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
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerAIAnalysis = void 0;
const extractTextFromPDF_1 = require("./extractTextFromPDF");
const extractTextFromWord_1 = require("./extractTextFromWord");
const sendToOpenAIForAnalysis_1 = require("./sendToOpenAIForAnalysis");
const writeAIDecisionToFirestore_1 = require("./writeAIDecisionToFirestore");
const recordAIDecisionToBlockchain_1 = require("./recordAIDecisionToBlockchain");
const triggerAIAnalysis = (disputeId, disputeData, initiatorFiles, respondentFiles) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Triggering AI analysis for dispute:', disputeId);
        const processFiles = (files) => __awaiter(void 0, void 0, void 0, function* () {
            const extractedTexts = [];
            if (files) {
                for (const file of files) {
                    let extractedText = '';
                    const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml' +
                        '.document';
                    // Handle PDFs
                    if (file.type === 'application/pdf') {
                        extractedText = yield (0, extractTextFromPDF_1.extractTextFromPDF)(file.content);
                        // Handle PDF from Buffer
                    }
                    else if (file.type === mimeType) {
                        extractedText = yield (0, extractTextFromWord_1.extractTextFromWord)(file.content);
                        // Handle Word from Buffer
                    }
                    extractedTexts.push({ name: file.name, content: extractedText });
                }
            }
            return extractedTexts;
        });
        // Process both initiator and respondent files
        const initiatorProcessedFiles = yield processFiles(initiatorFiles);
        const respondentProcessedFiles = yield processFiles(respondentFiles);
        console.log('Initiator Processed Files:', initiatorProcessedFiles);
        console.log('Respondent Processed Files:', respondentProcessedFiles);
        // At this stage, you have the extracted text from all the files.
        // You can now send this data to OpenAI for analysis.
        const analysisResult = yield (0, sendToOpenAIForAnalysis_1.sendToOpenAIForAnalysis)(disputeData, initiatorProcessedFiles, respondentProcessedFiles);
        console.log('AI Analysis Result:', analysisResult);
        const aiSummary = analysisResult; // The analysis result from OpenAI
        const aiDecision = analysisResult.slice(-1);
        // The AI decision is the last character ('0' or '1')
        if (aiDecision === '0' || aiDecision === '1') {
            yield (0, writeAIDecisionToFirestore_1.writeAIDecisionToFirestore)(disputeId, aiSummary, aiDecision);
            yield (0, recordAIDecisionToBlockchain_1.recordAIDecisionOnBlockchain)(disputeId, parseInt(aiDecision)); // Record decision on blockchain
        }
        else {
            throw new Error('Invalid decision returned by AI');
        }
    }
    catch (error) {
        console.error('Error in AI analysis:', error);
    }
});
exports.triggerAIAnalysis = triggerAIAnalysis;
//# sourceMappingURL=triggerAIAnalysis.js.map