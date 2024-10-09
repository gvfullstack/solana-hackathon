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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromWord = void 0;
const mammoth_1 = __importDefault(require("mammoth"));
/**
 * Extracts text from a Word document (docx) Buffer.
 * @param {Buffer} buffer - The Word document as a Buffer
 * @return {Promise<string>} A promise that
 * resolves to the extracted text from the document.
 */
const extractTextFromWord = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use mammoth to extract text from the Word document buffer
        const result = yield mammoth_1.default.extractRawText({ buffer });
        return result.value; // Return the extracted text
    }
    catch (error) {
        console.error('Error extracting text from Word document:', error);
        throw error;
    }
});
exports.extractTextFromWord = extractTextFromWord;
//# sourceMappingURL=extractTextFromWord.js.map