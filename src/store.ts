import {
  conversation,
  conversations,
  sentenceInterface,
} from "./interfaces.js";

export const conversationsStore: conversations = {};
export function addConversation(key: string, conversationData: conversation) {
  conversationsStore[key] = {
    interactedBefore: true,
    registered: {
      done: false,
      process: "none",
    },
    ...conversationData,
  };
}
export function updateIncompleteRegReason(phoneNumber: string) {
  conversationsStore[phoneNumber].registered = {
    done: false,
    process: "courseRepConfirm",
  };
}
export function addLastSentenceToConversation(
  key: string,
  lastBotSentence: sentenceInterface
) {
  conversationsStore[key].lastBotSentence = lastBotSentence;
  conversationsStore[key].previousSentences?.push(lastBotSentence);
}
console.log("ho");
export function getConversation(phoneNumber: string): conversation | undefined {
  return conversationsStore[phoneNumber];
}
export function setConversationID(phoneNumber: string, msgID: string) {
  conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
}
export function deleteConversation(phoneNumber: string) {
  delete conversationsStore[phoneNumber];
}

export function userIsNowRegistered(phoneNumber: string) {
  conversationsStore[phoneNumber].registered = {
    done: true,
    process: "none",
  };
}

export function updateUserDetailInConversation(
  phoneNumber: string,
  userDetail: {
    dept: string;
    courseRep: string;
  }
) {
  conversationsStore[phoneNumber]["userDetails"] = userDetail;
}
