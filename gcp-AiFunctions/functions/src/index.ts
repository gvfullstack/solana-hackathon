import * as admin from 'firebase-admin';
import {onDocumentUpdated, FirestoreEvent} from 'firebase-functions/v2/firestore';
import {listenToDisputeChanges} from './listenToDisputeChanges';

admin.initializeApp();

export const listenToDisputeChangesHandler = onDocumentUpdated(
    {document: 'disputes/{disputeId}'},
    async (event: FirestoreEvent<any>) => { // Explicit type for event
      const disputeId = event.params.disputeId;
      const disputeData = event.data?.after.data();

      // Call your listener function
      if (disputeData) {
        await listenToDisputeChanges(disputeId, disputeData);
      }
    }
);
