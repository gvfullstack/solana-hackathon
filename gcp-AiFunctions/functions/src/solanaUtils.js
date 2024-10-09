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
exports.getSolanaKeypair = void 0;
const web3_js_1 = require("@solana/web3.js");
const secret_manager_1 = require("@google-cloud/secret-manager");
const client = new secret_manager_1.SecretManagerServiceClient();
/**
 * Function to access secret version from Google Cloud Secret Manager
 * @param {string} secretName - The name of the secret to retrieve.
 * @return {Promise<string>} - The secret data in string format.
 * @throws Will throw an error if the secret is not found or is empty.
 */
function getSecret(secretName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const [version] = yield client.accessSecretVersion({
            name: `projects/461404588784/secrets/${secretName}/versions/latest`,
        });
        if ((_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) {
            return version.payload.data.toString();
        }
        else {
            throw new Error(`Secret ${secretName} not found or is empty.`);
        }
    });
}
/**
 * Exported function to retrieve Solana Keypair from Google Cloud Secret Manager
 * @return {Promise<Keypair>} - The Solana Keypair retrieved from
 *  the secret manager.
 * @throws Will throw an error if there is an issue retrieving the keypair.
 */
function getSolanaKeypair() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secretKey = yield getSecret('SOLANA_KEYPAIR');
            if (!secretKey) {
                throw new Error('Secret key is undefined.');
            }
            const secretKeyArray = JSON.parse(secretKey);
            return web3_js_1.Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
        }
        catch (error) {
            console.error('Error retrieving Solana keypair:', error);
            throw error;
        }
    });
}
exports.getSolanaKeypair = getSolanaKeypair;
//# sourceMappingURL=solanaUtils.js.map