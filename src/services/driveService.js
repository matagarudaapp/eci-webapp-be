const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

class GoogleDriveService {
  constructor() {
    this.initialize();
  }

  initialize() {
    try {
      // Load credentials from service account file
      const keyFile = path.join(__dirname, '../../google-drive-key.json');
      const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/drive']
      });

      this.driveClient = google.drive({ version: 'v3', auth });
    } catch (error) {
      console.error('Error initializing Google Drive service:', error);
      throw error;
    }
  }

  /**
   * Upload a file to Google Drive with chunked streaming for large files
   * @param {Object} file - The file object from multer
   * @param {String} folderId - Optional Google Drive folder ID to upload to
   * @returns {Promise<Object>} The uploaded file metadata
   */
  async uploadFile(file, folderId = null) {
    try {
      const fileMetadata = {
        name: file.originalname,
        mimeType: file.mimetype
      };

      // If a folder ID is provided, set the parent folder
      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      // Set up resumable upload for large files
      const resumableUpload = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path)
        },
        fields: 'id,name,webViewLink,webContentLink',
        supportsAllDrives: true,
        uploadType: 'resumable'
      });

      console.log(`File uploaded successfully: ${file.originalname}`);
      return resumableUpload.data;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw error;
    } finally {
      // Clean up the temporary file
      this.cleanupTempFile(file.path);
    }
  }

  /**
   * Make a file publicly accessible
   * @param {String} fileId - The Google Drive file ID
   */
  async makeFilePublic(fileId) {
    try {
      await this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
    } catch (error) {
      console.error('Error making file public:', error);
      throw error;
    }
  }

  /**
   * Delete a temporary file
   * @param {String} filePath - Path to the temporary file
   */
  cleanupTempFile(filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting temporary file:', err);
      }
    });
  }
}

module.exports = new GoogleDriveService();