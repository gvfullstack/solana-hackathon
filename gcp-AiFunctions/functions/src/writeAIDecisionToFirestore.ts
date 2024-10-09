import * as admin from 'firebase-admin';

// Initialize Firestore using the admin SDK
const db = admin.firestore();

export const writeAIDecisionToFirestore = async (
    disputeId: string,
    aiSummary: string,
    aiDecision: '0' | '1'
): Promise<void> => {
  try {
    // Get a reference to the dispute document in Firestore
    const disputeDocRef = db.collection('disputes').doc(disputeId);

    // Update the aiSummary and aiDecision fields in the Firestore document
    await disputeDocRef.update({
      aiSummary: aiSummary,
      aiDecision: aiDecision,
    });

    console.log(`AI decision and summary successfully written to Firestore for
       dispute ID: ${disputeId}`);
  } catch (error) {
    console.error(`Error updating AI decision in Firestore for dispute 
      ID: ${disputeId}`, error);
    throw new Error(`Failed to update Firestore with AI decision for 
      dispute: ${disputeId}`);
  }
};
