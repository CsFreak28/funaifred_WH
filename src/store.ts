import {
  conversation,
  conversations,
  sentenceInterface,
} from "./interfaces.js";

export const conversationsStore: conversations = {};
export function addConversation(key: string, conversationData: conversation) {
  conversationsStore[key] = conversationData;
}
export function addLastSentenceToConversation(
  key: string,
  lastBotSentence: sentenceInterface
) {
  conversationsStore[key].lastBotSentence = lastBotSentence;
  conversationsStore[key].previousSentences?.push(lastBotSentence);
}
export function getConversation(phoneNumber: string): conversation | undefined {
  return conversationsStore[phoneNumber];
}
export function setConversationID(phoneNumber: string, msgID: string) {
  conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
  let lengthOfPreviousSentencesArray =
    conversationsStore[phoneNumber].previousSentences?.length;
  let lastBotSentenceIndex =
    lengthOfPreviousSentencesArray !== undefined
      ? lengthOfPreviousSentencesArray - 1
      : undefined;
  let lastBotSentenceInPreviousSentences: sentenceInterface = {
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
