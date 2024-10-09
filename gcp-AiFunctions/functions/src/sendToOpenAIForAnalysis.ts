import OpenAI from 'openai';
import {getOpenAIKey} from './getOpenAIKey'; // Import the utility function

/**
 * Function to send the extracted text to OpenAI for dispute analysis.
 * @param {object} disputeData - The overall
 * dispute data including descriptions.
 * @param {Array<{name: string, content: string}>} initiatorProcessedFiles
 * - Processed files from the initiator.
 * @param {Array<{name: string, content: string}>} respondentProcessedFiles
 * - Processed files from the respondent.
 * @return {Promise<string>} - The analysis result from OpenAI.
 */

interface DisputeData {
    initiatorDescription: string;
    respondentDescription: string;
  }

export const sendToOpenAIForAnalysis = async (
    disputeData: DisputeData,
    initiatorProcessedFiles: Array<{ name: string; content: string }>,
    respondentProcessedFiles: Array<{ name: string; content: string }>
): Promise<string> => {
  try {
    // Retrieve the OpenAI API key from Secret Manager
    const apiKey = await getOpenAIKey();

    // Initialize OpenAI with the retrieved key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Construct the input data for GPT-4
    const initiatorContent = `
        **Initiator's Argument**: ${disputeData.initiatorDescription}
        **Initiator's Supporting Documents**:
        ${initiatorProcessedFiles.map((file) => `- ${file.name}:
             ${file.content.substring(0, 100)}...`).join('\n')}
        `;

    const respondentContent = `
        **Respondent's Argument**: ${disputeData.respondentDescription}
        **Respondent's Supporting Documents**:
        ${respondentProcessedFiles.map((file) => `- ${file.name}: 
            ${file.content.substring(0, 100)}...`).join('\n')}
        `;

    // Create a combined prompt for OpenAI
    const prompt = `
        A dispute has been raised with the following information. 

        ${initiatorContent}

        Respondent's response is:

        ${respondentContent}

        Your task is to carefully review the arguments and the supporting
         documents 
        from both the initiator and the respondent. Please provide:
        1. A clear and unbiased analysis of both arguments.
        2. Based on the evidence, conclude whether the initiator should be paid 
        or the respondent should be paid.
        Provide your decision as follows:
        - "0" if the initiator should be paid.
        - "1" if the respondent should be paid.

        Make sure your decision is the very last character of your response.
        `;

    // Call the OpenAI GPT-4 API
    const completion = await openai.completions.create({
      model: 'gpt-4', // Use GPT-4 model
      prompt: prompt,
      max_tokens: 1000, // Adjust based on the desired response length
      temperature: 0.5, // Adjust temperature for balanced responses
    });

    const analysis = completion.choices[0].text.trim();
    console.log('OpenAI Analysis:', analysis);

    // Extract the last character for the decision
    const decision = analysis.slice(-1);
    // The decision will be the last character, either '0' or '1'
    if (decision !== '0' && decision !== '1') {
      throw new Error('Invalid decision returned by AI');
    }

    return `${analysis}\nDecision: ${decision}`;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw error;
  }
};
