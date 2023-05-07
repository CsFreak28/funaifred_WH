import {
  reply,
  conversation,
  sentenceInterface,
  option,
  usersMsgData,
} from "./interfaces.js";
import { paymentReplies } from "./paymentReplies.js";
import replySentenceWithText from "./sendMessage.js";
import { Request } from "express";
class ChatBot {
  chatBotFunctions: {
    [name: string]: (conversationData: sentenceInterface) => reply;
  };
  constructor() {
    this.chatBotFunctions = {
      //add the replies of different categories
      ...paymentReplies,
    };
  }
  processKeyword = (message: string, usrSentence: sentenceInterface) => {
    //use chatgpt to clean the message and find out it's category, that message belongs to
    let cleanedMessage = message;
    //get the reply of processing the users message
    let resolve: undefined | reply =
      this.chatBotFunctions[cleanedMessage](usrSentence);
    if (resolve === undefined) {
      let noReply: reply = {
        message: [
          "I don't quite understand what you want me to do exactly",
          "did you mean",
        ],
        noReply: true,
        contextId: "",
      };
      return noReply;
    } else {
      return resolve;
    }
  };
  reply = (request: Request, resolve: reply) => {
    replySentenceWithText(request, resolve);
  };
  selectedOption = (conversation: conversation, usersMsgData: usersMsgData) => {
    if (usersMsgData.usrSentenceID) {
      //if the user's message has an id, check which sentence he was replying to
      let previousSentences = conversation.previousSentences;
      let sentenceUserReplied: sentenceInterface | undefined;
      let selectedOption: string | undefined;
      previousSentences?.forEach((sentence) => {
        sentence.msgId === usersMsgData.usrSentenceID &&
          (sentenceUserReplied = sentence);
      });
      if (sentenceUserReplied) {
        selectedOption =
          sentenceUserReplied.options !== null
            ? sentenceUserReplied.options[usersMsgData.usrSentence]
            : undefined;
      }
      return selectedOption;
    } else {
      //if users msg doesnt have a context id, then he may be replying to the lastbotSentence
      let lastBotSentence = conversation.lastBotSentence;
      let selectedOption: string | undefined =
        lastBotSentence.options !== null
          ? lastBotSentence.options[usersMsgData.usrSentence]
          : undefined;
      return selectedOption;
    }
  };
}
