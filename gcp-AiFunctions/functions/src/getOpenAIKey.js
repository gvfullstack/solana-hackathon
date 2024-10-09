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
exports.getOpenAIKey = void 0;
const secret_manager_1 = require("@google-cloud/secret-manager");
// Initialize the Secret Manager client
const client = new secret_manager_1.SecretManagerServiceClient();
/**
 * Function to access secret version
 * @param {string} secretName - The name of the secret to retrieve
 * @return {Promise<string>} - The secret value as a string
 */
const getOpenAIKey = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const [version] = yield client.accessSecretVersion({
            name: 'projects/461404588784/secrets/OPENAI_API_KEY/versions/latest',
        });
        const key = (_b = (_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
        if (!key) {
            throw new Error('Failed to retrieve OpenAI API key from Secret Manager');
        }
        return key;
    }
    catch (error) {
        console.error('Error retrieving OpenAI API key:', error);
        throw error;
    }
});
exports.getOpenAIKey = getOpenAIKey;
//# sourceMappingURL=getOpenAIKey.js.map