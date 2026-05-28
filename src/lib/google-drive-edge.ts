/**
 * Google Drive upload using direct REST API (Edge Runtime compatible)
 * Uses JWT for authentication instead of the googleapis SDK
 * Uses @cloudflare/next-on-pages getRequestContext() for env vars on Cloudflare Pages
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

const SCOPE = 'https://www.googleapis.com/auth/drive';

function getEnv(key: string): string | undefined {
  // Try Cloudflare Worker env first (via getRequestContext)
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.[key]) {
      return ctx.env[key] as string;
    }
  } catch {
    // Not running on Cloudflare Pages, fall through
  }

  // Fall back to process.env (works locally with .env)
  return process.env[key];
}

function getDriveFolderId(): string {
  return getEnv('GOOGLE_DRIVE_FOLDER_ID') || '19KNj17fShhyItV2IiAyC5J2y6gSGm5vx';
}

async function getAccessToken(): Promise<string> {
  const clientEmail = getEnv('GOOGLE_DRIVE_CLIENT_EMAIL');
  const privateKey = getEnv('GOOGLE_DRIVE_PRIVATE_KEY');

  if (!clientEmail || !privateKey) {
    console.error('Missing Google Drive credentials. Client email:', clientEmail ? 'SET' : 'MISSING', 'Private key:', privateKey ? 'SET' : 'MISSING');
    throw new Error('Google Drive credentials not configured.');
  }

  // Create JWT
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  // Base64URL encode
  const base64url = (data: string) =>
    btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  // Import private key
  const pemKey = privateKey.replace(/\\n/g, '\n');
  const keyContent = pemKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const keyBuffer = Uint8Array.from(atob(keyContent), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signInput)
  );

  const encodedSignature = base64url(
    String.fromCharCode(...new Uint8Array(signature))
  );

  const jwt = `${signInput}.${encodedSignature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    throw new Error(`Failed to get Google access token: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

export async function uploadToDrive(
  fileBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string,
  folderId?: string
): Promise<{ id: string; url: string; webViewLink: string }> {
  const accessToken = await getAccessToken();

  // Create metadata - use provided folderId or default
  const metadata = {
    name: fileName,
    parents: [folderId || getDriveFolderId()],
  };

  // Upload using multipart/related
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadataPart =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata);

  const filePart =
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n`;

  // Combine parts
  const encoder = new TextEncoder();
  const metadataBytes = encoder.encode(metadataPart);
  const fileHeaderBytes = encoder.encode(filePart);
  const closingBytes = encoder.encode(closeDelim);

  const bodyLength = metadataBytes.length + fileHeaderBytes.length + fileBuffer.byteLength + closingBytes.length;
  const body = new Uint8Array(bodyLength);
  body.set(metadataBytes, 0);
  body.set(fileHeaderBytes, metadataBytes.length);
  body.set(new Uint8Array(fileBuffer), metadataBytes.length + fileHeaderBytes.length);
  body.set(closingBytes, metadataBytes.length + fileHeaderBytes.length + fileBuffer.byteLength);

  const uploadResponse = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body,
    }
  );

  const uploadData = await uploadResponse.json();

  if (!uploadData.id) {
    throw new Error(`Failed to upload to Google Drive: ${JSON.stringify(uploadData)}`);
  }

  const fileId = uploadData.id;

  // Make file publicly accessible
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    }
  );

  const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
  const webViewLink = uploadData.webViewLink || directUrl;

  return {
    id: fileId,
    url: directUrl,
    webViewLink: webViewLink,
  };
}

export async function deleteFromDrive(fileId: string): Promise<void> {
  const accessToken = await getAccessToken();

  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
