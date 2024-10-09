import * as anchor from '@project-serum/anchor';
import {Connection, PublicKey, Keypair, Transaction} from '@solana/web3.js';
import {Program, AnchorProvider} from '@project-serum/anchor';
import {getSolanaKeypair} from './solanaUtils';
import idl from '../../../../../target/idl/dispute_resolution_dapp.json';


/**
 * Custom Wallet class to handle Keypair.
 * Used for signing transactions and interacting with the
 * Solana blockchain.
 */
class Wallet {
  readonly payer: Keypair;

  /**
   * Constructs the Wallet object.
   * @param {Keypair} payer - The Solana keypair.
   */
  constructor(payer: Keypair) {
    this.payer = payer;
  }

  /**
   * Signs a Solana transaction.
   * @param {Transaction} tx - The transaction to sign.
   * @return {Promise<Transaction>} - The signed transaction.
   */
  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  /**
   * Signs multiple Solana transactions.
   * @param {Transaction[]} txs - The transactions to sign.
   * @return {Promise<Transaction[]>} - The signed transactions.
   */
  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    txs.forEach((tx) => tx.partialSign(this.payer));
    return txs;
  }

  /**
   * Returns the public key associated with this wallet.
   * @return {PublicKey} - The wallet's public key.
   */
  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}


export const recordAIDecisionOnBlockchain = async (
    disputeAccountPubkey: string,
    decision: number
): Promise<void> => {
  try {
    if (decision !== 0 && decision !== 1) {
      throw new Error('Invalid decision value. It must be 0 or 1.');
    }

    // Load Solana keypair for the AI backend from Secret Manager
    const aiWallet = await getSolanaKeypair();

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const provider = new AnchorProvider(connection, new Wallet(aiWallet), {
      preflightCommitment: 'processed',
    });

    const programId =
      new PublicKey('9QLvXJoG7Brp8d4RKTJdq7Yob6ySSFk646tTLB9dkiKb');

    // Initialize the program
    const program = new Program(idl as anchor.Idl, programId, provider);

    const disputeAccount = new PublicKey(disputeAccountPubkey);

    // Call the 'recordDecision' function using 'methods'
    await program.methods
        .recordDecision(new anchor.BN(decision))
        .accounts({
          disputeAccount: disputeAccount,
          aiBackend: aiWallet.publicKey,
        })
        .signers([aiWallet])
        .rpc();

    console.log('AI decision recorded on the blockchain.');
  } catch (error) {
    console.error('Error recording AI decision on the blockchain:',
        error);
    throw error;
  }
};
