import {
  reply,
  conversation,
  sentenceInterface,
  option,
  usersMsgData,
} from "./interfaces.js";
import { noExistuserReplies } from "./noExistUser.js";
import { paymentReplies } from "./paymentReplies.js";
import replySentenceWithText from "./sendMessage.js";
import { Request } from "express";
export default class ChatBot {
  chatBotFunctions: {
    [name: string]: (conversationData: usersMsgData) => reply;
  };
  constructor() {
    this.chatBotFunctions = {
      //add the replies of different categories
      ...paymentReplies,
      ...noExistuserReplies,
    };
  }
  processKeyword = (message: string, usrsMessage: usersMsgData) => {
    //use chatgpt to clean the message and find out it's category, that message belongs to
    let cleanedMessage = message;
    //get the reply of processing the users message
    let resolve: undefined | reply =
      this.chatBotFunctions[cleanedMessage](usrsMessage);
    if (resolve === undefined) {
      let noReply: reply = {
        message: [
          "I don't quite understand what you want me to do exactly",
          "did you mean",
        ],
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
