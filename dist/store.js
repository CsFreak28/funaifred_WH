export const conversationsStore = {};
export function addConversation(key, conversationData) {
    conversationsStore[key] = Object.assign({ interactedBefore: true, registered: {
            done: false,
            process: "none",
        } }, conversationData);
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
console.log("ho");
export function getConversation(phoneNumber) {
    return conversationsStore[phoneNumber];
}
export function setConversationID(phoneNumber, msgID) {
    conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
}
export function deleteConversation(phoneNumber) {
    delete conversationsStore[phoneNumber];
}
export function userIsNowRegistered(phoneNumber) {
    conversationsStore[phoneNumber].registered = {
        done: true,
        process: "none",
    };
}
export function updateUserDetailInConversation(phoneNumber, userDetail) {
    conversationsStore[phoneNumber]["userDetails"] = userDetail;
}
