"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToOpenAIForAnalysis = void 0;
const openai_1 = __importDefault(require("openai"));
const getOpenAIKey_1 = require("./getOpenAIKey"); // Import the utility function
const sendToOpenAIForAnalysis = (disputeData, initiatorProcessedFiles, respondentProcessedFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the OpenAI API key from Secret Manager
        const apiKey = yield (0, getOpenAIKey_1.getOpenAIKey)();
        // Initialize OpenAI with the retrieved key
        const openai = new openai_1.default({
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
        const completion = yield openai.completions.create({
            model: 'gpt-4',
            prompt: prompt,
            max_tokens: 1000,
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
    }
    catch (error) {
        console.error('Error in AI analysis:', error);
        throw error;
    }
});
exports.sendToOpenAIForAnalysis = sendToOpenAIForAnalysis;
//# sourceMappingURL=sendToOpenAIForAnalysis.js.map