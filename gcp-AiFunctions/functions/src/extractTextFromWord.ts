import mammoth from 'mammoth';

/**
 * Extracts text from a Word document (docx) Buffer.
 * @param {Buffer} buffer - The Word document as a Buffer
 * @return {Promise<string>} A promise that
 * resolves to the extracted text from the document.
 */
export const extractTextFromWord = async (buffer: Buffer): Promise<string> => {
  try {
    // Use mammoth to extract text from the Word document buffer
    const result = await mammoth.extractRawText({buffer});

    return result.value; // Return the extracted text
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw error;
  }
};
