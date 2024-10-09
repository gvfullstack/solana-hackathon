import {extractTextFromPDF} from './extractTextFromPDF';
import {extractTextFromWord} from './extractTextFromWord';
import {sendToOpenAIForAnalysis} from './sendToOpenAIForAnalysis';
import {writeAIDecisionToFirestore} from './writeAIDecisionToFirestore';
import {recordAIDecisionOnBlockchain} from './recordAIDecisionToBlockchain';

export const triggerAIAnalysis = async (
    disputeId: string,
    disputeData: any,
    initiatorFiles: Array<{ name: string; content: string |
        Buffer, type: string }> | null,
    respondentFiles: Array<{ name: string; content: string |
        Buffer, type: string }> | null
) => {
  try {
    console.log('Triggering AI analysis for dispute:', disputeId);

    const processFiles = async (files: Array<{ name: string;
        content: string | Buffer, type: string }> | null) => {
      const extractedTexts: Array<{ name: string; content: string }> = [];

      if (files) {
        for (const file of files) {
          let extractedText = '';
          const mimeType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml' +
          '.document';
          // Handle PDFs
          if (file.type === 'application/pdf') {
            extractedText = await extractTextFromPDF(file.content as Buffer);
            // Handle PDF from Buffer
          } else if (file.type === mimeType
          ) {
            extractedText = await extractTextFromWord(file.content as Buffer);
            // Handle Word from Buffer
          }

          extractedTexts.push({name: file.name, content: extractedText});
        }
      }

      return extractedTexts;
    };

    // Process both initiator and respondent files
    const initiatorProcessedFiles = await processFiles(initiatorFiles);
    const respondentProcessedFiles = await processFiles(respondentFiles);

    console.log('Initiator Processed Files:', initiatorProcessedFiles);
    console.log('Respondent Processed Files:', respondentProcessedFiles);

    // At this stage, you have the extracted text from all the files.
    // You can now send this data to OpenAI for analysis.

    const analysisResult = await sendToOpenAIForAnalysis(
        disputeData,
        initiatorProcessedFiles,
        respondentProcessedFiles
    );

    console.log('AI Analysis Result:', analysisResult);

    const aiSummary = analysisResult; // The analysis result from OpenAI
    const aiDecision = analysisResult.slice(-1);
    // The AI decision is the last character ('0' or '1')

    if (aiDecision === '0' || aiDecision === '1') {
      await writeAIDecisionToFirestore(disputeId, aiSummary,
        aiDecision as '0' | '1');
      await recordAIDecisionOnBlockchain(disputeId,
          parseInt(aiDecision)); // Record decision on blockchain
    } else {
      throw new Error('Invalid decision returned by AI');
    }
  } catch (error) {
    console.error('Error in AI analysis:', error);
  }
};
