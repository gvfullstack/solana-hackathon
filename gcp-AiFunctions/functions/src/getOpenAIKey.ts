import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

// Initialize the Secret Manager client
const client = new SecretManagerServiceClient();

/**
 * Function to access secret version
 * @param {string} secretName - The name of the secret to retrieve
 * @return {Promise<string>} - The secret value as a string
 */
export const getOpenAIKey = async (): Promise<string> => {
  try {
    const [version] = await client.accessSecretVersion({
      name: 'projects/461404588784/secrets/OPENAI_API_KEY/versions/latest',
    });
    const key = version.payload?.data?.toString();
    if (!key) {
      throw new Error('Failed to retrieve OpenAI API key from Secret Manager');
    }
    return key;
  } catch (error) {
    console.error('Error retrieving OpenAI API key:', error);
    throw error;
  }
};
