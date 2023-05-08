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
