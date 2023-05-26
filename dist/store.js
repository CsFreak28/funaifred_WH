import { addConversationToUserDB, addLastSentenceToUserDB, updateChainAnswer, updateUserDetail, updateUserIsNowRegistered, } from "./db.js";
export const conversationsStore = {};
export function addConversation(key, conversationData) {
    conversationsStore[key] = Object.assign({ chainAnswers: [], interactedBefore: true, registered: {
            done: false,
            process: "none",
        } }, conversationData);
    addConversationToUserDB(key, Object.assign({ interactedBefore: true, registered: {
            done: false,
            process: "none",
        } }, conversationData));
}
export function updateIncompleteRegReason(phoneNumber) {
    conversationsStore[phoneNumber].registered = {
        done: false,
        process: "courseRepConfirm",
    };
}
export function addLastSentenceToConversation(key, lastBotSentence) {
    var _a;
    conversationsStore[key].lastBotSentence = lastBotSentence;
    (_a = conversationsStore[key].previousSentences) === null || _a === void 0 ? void 0 : _a.push(lastBotSentence);
}
export function getConversation(phoneNumber) {
    return conversationsStore[phoneNumber];
}
export function setConversationID(phoneNumber, msgID) {
    conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
    addLastSentenceToUserDB(phoneNumber, conversationsStore[phoneNumber].lastBotSentence);
}
export function setConversation(phoneNumber, conversation) {
    conversationsStore[phoneNumber] = conversation;
}
export function deleteConversation(phoneNumber) {
    delete conversationsStore[phoneNumber];
}
export function userIsNowRegistered(phoneNumber) {
    conversationsStore[phoneNumber].registered = {
        done: true,
        process: "none",
    };
    updateUserIsNowRegistered(phoneNumber);
}
export function updateUserDetailInConversation(phoneNumber, userDetail) {
    conversationsStore[phoneNumber]["studentInfo"] = userDetail;
    updateUserDetail(phoneNumber, userDetail);
}
export function pushComboAnswer(phoneNumber, answer) {
    let chainAnswers = conversationsStore[phoneNumber].chainAnswers;
    console.log("chain chain");
    if (chainAnswers !== undefined) {
        chainAnswers.push(answer);
        console.log("conversation Chain", conversationsStore[phoneNumber].chainAnswers);
    }
    updateChainAnswer(phoneNumber, "push");
}
export function getComboAnswer(phoneNumber) {
    let chainAnswers = conversationsStore[phoneNumber].chainAnswers;
    let chainAnswer = "";
    if (chainAnswers) {
        if (chainAnswers.length > 0) {
            chainAnswers.forEach((ans) => {
                console.log(ans);
                chainAnswer += ans;
            });
        }
    }
    return chainAnswer;
}
export function clearComboAnswers(phoneNumber) {
    conversationsStore[phoneNumber].chainAnswers = [];
    updateChainAnswer(phoneNumber, "clear");
}
