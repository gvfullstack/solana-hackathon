import {triggerAIAnalysis} from './triggerAIAnalysis';
import {downloadFiles} from './downloadFiles';

export const listenToDisputeChanges = async (change: any, context: any) => {
  const disputeId = context.params.disputeId;
  const disputeData = change.after.data();

  if (!disputeData) return;

  const bothResponsesSubmitted = disputeData.respondentResponseSubmitted &&
  disputeData.initiatorResponseSubmitted;

  if (bothResponsesSubmitted) {
    console.log(
        'Both parties have submitted their responses. Triggering AI analysis...'
    );

    try {
      let initiatorFiles = null;
      let respondentFiles = null;

      if (disputeData.initiatorDocuments) {
        initiatorFiles = await downloadFiles(disputeData.initiatorDocuments,
            disputeData.disputeId, disputeData.initiatorId);
      }

      if (disputeData.respondentDocuments) {
        respondentFiles = await downloadFiles(disputeData.respondentDocuments,
            disputeData.disputeId, disputeData.respondentId);
      }

      await triggerAIAnalysis(disputeId, disputeData, initiatorFiles,
          respondentFiles);
    } catch (error) {
      console.error('Error triggering AI analysis:', error);
    }
  }
};
