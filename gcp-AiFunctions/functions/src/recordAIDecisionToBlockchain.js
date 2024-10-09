"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.recordAIDecisionOnBlockchain = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const solanaUtils_1 = require("./solanaUtils");
const dispute_resolution_dapp_json_1 = __importDefault(require("../../../../../target/idl/dispute_resolution_dapp.json"));
/**
 * Custom Wallet class to handle Keypair.
 * Used for signing transactions and interacting with the
 * Solana blockchain.
 */
class Wallet {
    /**
     * Constructs the Wallet object.
     * @param {Keypair} payer - The Solana keypair.
     */
    constructor(payer) {
        this.payer = payer;
    }
    /**
     * Signs a Solana transaction.
     * @param {Transaction} tx - The transaction to sign.
     * @return {Promise<Transaction>} - The signed transaction.
     */
    signTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            tx.partialSign(this.payer);
            return tx;
        });
    }
    /**
     * Signs multiple Solana transactions.
     * @param {Transaction[]} txs - The transactions to sign.
     * @return {Promise<Transaction[]>} - The signed transactions.
     */
    signAllTransactions(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            txs.forEach((tx) => tx.partialSign(this.payer));
            return txs;
        });
    }
    /**
     * Returns the public key associated with this wallet.
     * @return {PublicKey} - The wallet's public key.
     */
    get publicKey() {
        return this.payer.publicKey;
    }
}
const recordAIDecisionOnBlockchain = (disputeAccountPubkey, decision) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (decision !== 0 && decision !== 1) {
            throw new Error('Invalid decision value. It must be 0 or 1.');
        }
        // Load Solana keypair for the AI backend from Secret Manager
        const aiWallet = yield (0, solanaUtils_1.getSolanaKeypair)();
        const connection = new web3_js_1.Connection('https://api.devnet.solana.com', 'confirmed');
        const provider = new anchor_1.AnchorProvider(connection, new Wallet(aiWallet), {
            preflightCommitment: 'processed',
        });
        const programId = new web3_js_1.PublicKey('9QLvXJoG7Brp8d4RKTJdq7Yob6ySSFk646tTLB9dkiKb');
        // Initialize the program
        const program = new anchor_1.Program(dispute_resolution_dapp_json_1.default, programId, provider);
        const disputeAccount = new web3_js_1.PublicKey(disputeAccountPubkey);
        // Call the 'recordDecision' function using 'methods'
        yield program.methods
            .recordDecision(new anchor.BN(decision))
            .accounts({
            disputeAccount: disputeAccount,
            aiBackend: aiWallet.publicKey,
        })
            .signers([aiWallet])
            .rpc();
        console.log('AI decision recorded on the blockchain.');
    }
    catch (error) {
        console.error('Error recording AI decision on the blockchain:', error);
        throw error;
    }
});
exports.recordAIDecisionOnBlockchain = recordAIDecisionOnBlockchain;
//# sourceMappingURL=recordAIDecisionToBlockchain.js.map