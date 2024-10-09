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
exports.listenToDisputeChanges = void 0;
const triggerAIAnalysis_1 = require("./triggerAIAnalysis");
const downloadFiles_1 = require("./downloadFiles");
const listenToDisputeChanges = (change, context) => __awaiter(void 0, void 0, void 0, function* () {
    const disputeId = context.params.disputeId;
    const disputeData = change.after.data();
    if (!disputeData)
        return;
    const bothResponsesSubmitted = disputeData.respondentResponseSubmitted &&
        disputeData.initiatorResponseSubmitted;
    if (bothResponsesSubmitted) {
        console.log('Both parties have submitted their responses. Triggering AI analysis...');
        try {
            let initiatorFiles = null;
            let respondentFiles = null;
            if (disputeData.initiatorDocuments) {
                initiatorFiles = yield (0, downloadFiles_1.downloadFiles)(disputeData.initiatorDocuments, disputeData.disputeId, disputeData.initiatorId);
            }
            if (disputeData.respondentDocuments) {
                respondentFiles = yield (0, downloadFiles_1.downloadFiles)(disputeData.respondentDocuments, disputeData.disputeId, disputeData.respondentId);
            }
            yield (0, triggerAIAnalysis_1.triggerAIAnalysis)(disputeId, disputeData, initiatorFiles, respondentFiles);
        }
        catch (error) {
            console.error('Error triggering AI analysis:', error);
        }
    }
});
exports.listenToDisputeChanges = listenToDisputeChanges;
//# sourceMappingURL=listenToDisputeChanges.js.map