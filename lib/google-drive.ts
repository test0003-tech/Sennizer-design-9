import { google } from 'googleapis';
import path from 'path';
import { readFileSync } from 'fs';
import { Readable } from 'stream';

const DRIVE_FOLDER_ID = '1VppQM7rHDQSmFS4tsXSXUV3FBGaWN8l2';

function getAuth() {
  const credentialsPath = path.join(process.cwd(), 'lib', 'gdrive-credentials.json');
  const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));

  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive.file']
  );

  return auth;
}

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ id: string; url: string; webViewLink: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  // Upload file to Google Drive
  const uploadResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: mimeType,
      body: Readable.from(fileBuffer),
    },
    fields: 'id, webContentLink, webViewLink',
  });

  const fileId = uploadResponse.data.id;

  if (!fileId) {
    throw new Error('Failed to upload file to Google Drive');
  }

  // Make the file publicly accessible
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Get the public URL
  const fileResponse = await drive.files.get({
    fileId: fileId,
    fields: 'webContentLink, webViewLink',
  });

  const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
  const webViewLink = fileResponse.data.webViewLink || directUrl;

  return {
    id: fileId,
    url: directUrl,
    webViewLink: webViewLink,
  };
}

export async function deleteFromDrive(fileId: string): Promise<void> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  await drive.files.delete({
    fileId: fileId,
  });
}
