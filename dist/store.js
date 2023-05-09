export const conversationsStore = {};
export function addConversation(key, conversationData) {
    conversationsStore[key] = conversationData;
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
    var _a;
    conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
    let lengthOfPreviousSentencesArray = (_a = conversationsStore[phoneNumber].previousSentences) === null || _a === void 0 ? void 0 : _a.length;
    let lastBotSentenceIndex = lengthOfPreviousSentencesArray !== undefined
        ? lengthOfPreviousSentencesArray - 1
        : undefined;
    let lastBotSentenceInPreviousSentences = {
        msgId: "",
        options: {},
    };
    if (lastBotSentenceIndex) {
        if (conversationsStore[phoneNumber].previousSentences !== null) {
            lastBotSentenceInPreviousSentences =
                conversationsStore[phoneNumber].previousSentences[0];
        }
    }
    lastBotSentenceInPreviousSentences.msgId = msgID;
}
export function deleteConversation(phoneNumber) { }
