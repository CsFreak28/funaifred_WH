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
import { getDoc, doc, collection, updateDoc, arrayUnion, setDoc, } from "firebase/firestore";
let studentProfileCollection = "studentProfiles";
let portalLogins = "";
export function userExistsInDB(phoneNumber, whatToReturn) {
    return __awaiter(this, void 0, void 0, function* () {
        //get the users record from firebase
        const docRef = doc(db, studentProfileCollection, `${phoneNumber}`);
        const docSnap = yield getDoc(docRef);
        let usersDBRecord = undefined;
        if (docSnap.exists()) {
            if (whatToReturn === "conversation") {
                usersDBRecord = docSnap.data().conversation;
            }
            else {
                usersDBRecord = docSnap.data();
            }
        }
        return usersDBRecord;
    });
}
export function addConversationToUserDB(phoneNumber, conversation) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvoRef = doc(db, studentProfileCollection, phoneNumber);
        const collectionRef = collection(db, studentProfileCollection);
        console.log("i am the problem");
        if (yield userExistsInDB(phoneNumber, "conversation")) {
            console.log("sammyghcdjjsgf");
            yield updateDoc(userConvoRef, {
                conversation: conversation,
            });
            console.log("updated doc");
        }
        else {
            console.log("i am the problem");
            setDoc(doc(db, studentProfileCollection, phoneNumber), {
                conversation: conversation,
            });
        }
    });
}
export function addLastSentenceToUserDB(phoneNumber, conversation) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvoRef = doc(db, studentProfileCollection, phoneNumber);
        yield updateDoc(userConvoRef, {
            "conversation.lastBotSentence": conversation,
            "conversation.previousSentences": arrayUnion(conversation),
        });
        console.log("addedlastSentence : updated doc");
    });
}
export function updateUserIsNowRegistered(phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvRef = doc(db, studentProfileCollection, phoneNumber);
        yield updateDoc(userConvRef, {
            "conversation.registered": {
                done: true,
                process: "none",
            },
        });
        console.log("updateUserdetail : update doc");
    });
}
export function updateUserDetail(phoneNumber, userDetail) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvRef = doc(db, studentProfileCollection, phoneNumber);
        yield updateDoc(userConvRef, {
            "conversation.userDetails": {
                dept: userDetail.dept,
                courseRep: userDetail.courseRep,
            },
        });
    });
}
export function updateIncompleteRegReasonInDB(phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvRef = doc(db, studentProfileCollection, phoneNumber);
        yield updateDoc(userConvRef, {
            "conversation.registered": {
                done: false,
                process: "courseRepConfirm",
            },
        });
        console.log("updateIncompleteRegReasonInDB : update doc");
    });
}
export function updateChainAnswer(phoneNumber, action, answer) {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvRef = doc(db, studentProfileCollection, phoneNumber);
        if (action === "clear") {
            yield updateDoc(userConvRef, {
                "conversation.chainAnswers": [],
            });
        }
        else {
            if (answer !== undefined) {
                yield updateDoc(userConvRef, {
                    "conversation.chainAnswers": arrayUnion(answer),
                });
            }
        }
    });
}
export function clearSentences(phoneNumber = "2348088663596") {
    return __awaiter(this, void 0, void 0, function* () {
        const userConvRef = doc(db, studentProfileCollection, phoneNumber);
        yield updateDoc(userConvRef, {
            "conversation.previousSentences": [],
        });
        console.log("clearing done");
    });
}
export function checkIfLoginsAreAvailable(collection, phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = doc(db, collection, `${phoneNumber}`);
        const docSnap = yield getDoc(docRef);
        let usersDBRecord = undefined;
        if (docSnap.exists()) {
            usersDBRecord = docSnap.data();
        }
        return usersDBRecord;
    });
}
function getDifferenceInHours(date1, date2) {
    // Convert the dates to milliseconds
    const milliseconds1 = date1.getTime();
    const milliseconds2 = date2.getTime();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = milliseconds2 - milliseconds1;
    // Calculate the difference in hours
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
    console.log(differenceInHours);
    // Return the difference in hours
    return differenceInHours;
}
