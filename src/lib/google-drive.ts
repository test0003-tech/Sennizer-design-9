import { google } from 'googleapis';
import { Readable } from 'stream';

const DRIVE_FOLDER_ID = '1VppQM7rHDQSmFS4tsXSXUV3FBGaWN8l2';

function getAuth() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive credentials not configured. Set GOOGLE_DRIVE_CLIENT_EMAIL and GOOGLE_DRIVE_PRIVATE_KEY environment variables.');
  }

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey.replace(/\\n/g, '\n'),
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
