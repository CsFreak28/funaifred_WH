var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "./firebaseConfig.js";
import { getDoc, doc, } from "firebase/firestore";
export function userExistsInDB(phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        //get the users record from firebase
        const docRef = doc(db, "conversations", `${phoneNumber}`);
        const docSnap = yield getDoc(docRef);
        let usersDBRecord = undefined;
        if (docSnap.exists()) {
            usersDBRecord = docSnap.data().conversation;
        }
        return usersDBRecord;
    });
}
export function addConversationToUserDB(phoneNumber, conversation) {
    return __awaiter(this, void 0, void 0, function* () { });
}
