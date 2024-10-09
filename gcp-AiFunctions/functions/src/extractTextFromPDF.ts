import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF buffer.
 * @param {Buffer} buffer - The PDF document as a Buffer
 * @returns {Promise<string>} - A promise that resolves to the extracted text
 */

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    // Extract text from the PDF buffer using pdf-parse
    const data = await pdf(buffer);

    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};
