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
exports.extractTextFromPDF = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
/**
 * Extracts text from a PDF buffer.
 * @param {Buffer} buffer - The PDF document as a Buffer
 * @returns {Promise<string>} - A promise that resolves to the extracted text
 */
const extractTextFromPDF = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract text from the PDF buffer using pdf-parse
        const data = yield (0, pdf_parse_1.default)(buffer);
        // Return the extracted text
        return data.text;
    }
    catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw error;
    }
});
exports.extractTextFromPDF = extractTextFromPDF;
//# sourceMappingURL=extractTextFromPDF.js.map