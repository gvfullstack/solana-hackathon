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
exports.listenToDisputeChangesHandler = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/lib/v2/providers/firestore");
const listenToDisputeChanges_1 = require("./listenToDisputeChanges");
admin.initializeApp();
exports.listenToDisputeChangesHandler = (0, firestore_1.onDocumentUpdated)({ document: 'disputes/{disputeId}' }, (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const disputeId = event.params.disputeId;
    const disputeData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
    // Call your listener function
    if (disputeData) {
        yield (0, listenToDisputeChanges_1.listenToDisputeChanges)(disputeId, disputeData);
    }
}));
//# sourceMappingURL=index.js.map