import * as admin from 'firebase-admin';


const bucket = admin.storage().bucket();

export const downloadFiles = async (
    files: Array<{ name: string; size: number; url: string }>,
    disputeId: string, // Include disputeId to construct file path
    userId: string // Include userId for folder structure
): Promise<Array<{ name: string; content: string | Buffer; type: string }>> => {
  const fileContents = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = `disputes/${disputeId}/${userId}/${file.name}`;
          const fileRef = bucket.file(filePath);

          // Download the file from Firebase Storage
          const [fileBuffer] = await fileRef.download();
          const [metadata] = await fileRef.getMetadata();
          const contentType = metadata.contentType || 'unknown';

          console.log(`Downloaded file ${file.name}, type: ${contentType}`);

          return {
            name: file.name,
            content: fileBuffer, // Returning Buffer or Blob
            type: contentType,
          };
        } catch (error) {
          console.error(`Error downloading file ${file.name}:`, error);
          throw error;
        }
      })
  );

  return fileContents; // Return the files with content and type
};
