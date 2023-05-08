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
