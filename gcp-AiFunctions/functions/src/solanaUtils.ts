import {Keypair} from '@solana/web3.js';
import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

/**
 * Function to access secret version from Google Cloud Secret Manager
 * @param {string} secretName - The name of the secret to retrieve.
 * @return {Promise<string>} - The secret data in string format.
 * @throws Will throw an error if the secret is not found or is empty.
 */
async function getSecret(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/461404588784/secrets/${secretName}/versions/latest`,
  });

  if (version.payload?.data) {
    return version.payload.data.toString();
  } else {
    throw new Error(`Secret ${secretName} not found or is empty.`);
  }
}

/**
 * Exported function to retrieve Solana Keypair from Google Cloud Secret Manager
 * @return {Promise<Keypair>} - The Solana Keypair retrieved from
 *  the secret manager.
 * @throws Will throw an error if there is an issue retrieving the keypair.
 */
export async function getSolanaKeypair(): Promise<Keypair> {
  try {
    const secretKey = await getSecret('SOLANA_KEYPAIR');
    if (!secretKey) {
      throw new Error('Secret key is undefined.');
    }

    const secretKeyArray = JSON.parse(secretKey);
    return Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
  } catch (error) {
    console.error('Error retrieving Solana keypair:', error);
    throw error;
  }
}
