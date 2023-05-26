import {
  conversation,
  conversations,
  sentenceInterface,
} from "./interfaces.js";
import {
  addConversationToUserDB,
  addLastSentenceToUserDB,
  updateChainAnswer,
  updateUserDetail,
  updateUserIsNowRegistered,
} from "./db.js";
export const conversationsStore: conversations = {};
export function addConversation(key: string, conversationData: conversation) {
  conversationsStore[key] = {
    chainAnswers: [],
    interactedBefore: true,
    registered: {
      done: false,
      process: "none",
    },
    ...conversationData,
  };
  addConversationToUserDB(key, {
    interactedBefore: true,
    registered: {
      done: false,
      process: "none",
    },
    ...conversationData,
  });
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
export function getConversation(phoneNumber: string): conversation | undefined {
  return conversationsStore[phoneNumber];
}
export function setConversationID(phoneNumber: string, msgID: string) {
  conversationsStore[phoneNumber].lastBotSentence.msgId = msgID;
  addLastSentenceToUserDB(
    phoneNumber,
    conversationsStore[phoneNumber].lastBotSentence
  );
}
export function setConversation(
  phoneNumber: string,
  conversation: conversation | any
) {
  conversationsStore[phoneNumber] = conversation;
}
export function deleteConversation(phoneNumber: string) {
  delete conversationsStore[phoneNumber];
}

export function userIsNowRegistered(phoneNumber: string) {
  conversationsStore[phoneNumber].registered = {
    done: true,
    process: "none",
  };
  updateUserIsNowRegistered(phoneNumber);
}

export function updateUserDetailInConversation(
  phoneNumber: string,
  userDetail: {
    dept: string;
    courseRep: string;
    level: string;
  }
) {
  conversationsStore[phoneNumber]["studentInfo"] = userDetail;
  updateUserDetail(phoneNumber, userDetail);
}
export function pushComboAnswer(phoneNumber: string, answer: string) {
  let chainAnswers = conversationsStore[phoneNumber].chainAnswers;
  console.log("chain chain");
  if (chainAnswers !== undefined) {
    chainAnswers.push(answer);
    console.log(
      "conversation Chain",
      conversationsStore[phoneNumber].chainAnswers
    );
  }
  updateChainAnswer(phoneNumber, "push");
}
export function getComboAnswer(phoneNumber: string) {
  let chainAnswers = conversationsStore[phoneNumber].chainAnswers;
  let chainAnswer: string | undefined = "";
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
export function clearComboAnswers(phoneNumber: string) {
  conversationsStore[phoneNumber].chainAnswers = [];
  updateChainAnswer(phoneNumber, "clear");
}
