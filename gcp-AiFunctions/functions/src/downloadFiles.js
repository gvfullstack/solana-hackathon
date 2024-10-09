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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFiles = void 0;
const admin = __importStar(require("firebase-admin"));
const bucket = admin.storage().bucket();
const downloadFiles = (files, disputeId, // Include disputeId to construct file path
userId // Include userId for folder structure
) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContents = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const filePath = `disputes/${disputeId}/${userId}/${file.name}`;
            const fileRef = bucket.file(filePath);
            // Download the file from Firebase Storage
            const [fileBuffer] = yield fileRef.download();
            const [metadata] = yield fileRef.getMetadata();
            const contentType = metadata.contentType || 'unknown';
            console.log(`Downloaded file ${file.name}, type: ${contentType}`);
            return {
                name: file.name,
                content: fileBuffer,
                type: contentType,
            };
        }
        catch (error) {
            console.error(`Error downloading file ${file.name}:`, error);
            throw error;
        }
    })));
    return fileContents; // Return the files with content and type
});
exports.downloadFiles = downloadFiles;
//# sourceMappingURL=downloadFiles.js.map