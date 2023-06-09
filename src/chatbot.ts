import { DocumentData } from "firebase/firestore";
import {
  reply,
  conversation,
  sentenceInterface,
  // option,
  usersMsgData,
  listReply,
} from "./interfaces.js";
// import { testReplies } from "./testReplies.js";
import { webscraperReplies } from "./webscraperReplies.js";
import { noExistuserReplies } from "./noExistUser.js";
import { startAndEndReplies } from "./startAndEndReplies.js";
// import { Replies } from "./types.js";
import replySentenceWithText, {
  reactToMessage,
  replySentenceWithInteractive,
  replySentenceWithList,
  sendResult,
} from "./sendMessage.js";
import { Request } from "express";
export default class ChatBot {
  chatBotFunctions: {
    [name: string]: (
      conversationData: usersMsgData
    ) => (reply | listReply)[] | Promise<reply[]>;
  };
  constructor() {
    this.chatBotFunctions = {
      //add the replies of different categories
      ...noExistuserReplies,
      ...startAndEndReplies,
      ...webscraperReplies,
      // ...testReplies,
      // ...adminReplies,
    };
  }
  processKeyword = async (
    message: string | { replyTo: string } | undefined,
    usrsMessage: usersMsgData
  ) => {
    //use chatgpt to clean the message and find out it's category, that message belongs to
    let reply: undefined | (reply | listReply)[];
    if (message !== undefined) {
      let cleanedMessage =
        typeof message === "string" ? message : message.replyTo;
      //get the reply of processing the users message
      reply = await this.chatBotFunctions[cleanedMessage](usrsMessage);
    }
    if (message === undefined || reply === undefined) {
      //check if the users message contains certain keywords
      let noReply: reply = {
        message: [
          `I don't understand what you mean by *"${usrsMessage.usrSentence}"* , \n in a future upgrade i may be capable of doing that, but right now I can't 😓.`,
        ],
      };
      return [noReply];
    } else {
      return reply;
    }
  };
  reply = async (request: Request, replies: any) => {
    let length = replies.length;
    if (length === 2) {
      await replySentenceWithText(request, replies[0]);
      await replySentenceWithList(request, replies[1]);
    } else {
      if (
        replies[0].typeOfReply !== undefined &&
        replies[0].typeOfReply === "list"
      ) {
        await replySentenceWithList(request, replies[0]);
      } else if (
        replies[0].typeOfReply !== undefined &&
        replies[0].typeOfReply === "reaction"
      ) {
        await reactToMessage(request, "💯");
      } else if (
        replies[0].typeOfReply !== undefined &&
        replies[0].typeOfReply === "interactive"
      ) {
        await replySentenceWithInteractive(request, replies[0].message[0]);
      } else if (
        replies[0].typeOfReply !== undefined &&
        replies[0].typeOfReply === "document"
      ) {
        await replySentenceWithText(request, replies[0]);
        sendResult(request);
      } else {
        await replySentenceWithText(request, replies[0]);
      }
    }
  };
  selectedOption = (
    conversation: conversation | DocumentData,
    usersMsgData: usersMsgData
  ) => {
    if (usersMsgData.sentenceUsrIsReplyingID) {
      //if the user's message has an id, check which sentence he was replying to

      let previousSentences = conversation.previousSentences;
      let sentenceUserReplied: sentenceInterface | undefined;
      let selectedOption: string | undefined;
      previousSentences?.forEach((sentence: sentenceInterface) => {
        sentence.msgId === usersMsgData.sentenceUsrIsReplyingID &&
          (sentenceUserReplied = sentence);
      });
      console.log("sentenceUserReplied", sentenceUserReplied);
      if (sentenceUserReplied) {
        selectedOption =
          sentenceUserReplied.options !== null
            ? sentenceUserReplied.options[usersMsgData.usrSentence]
            : sentenceUserReplied.freeReply !== undefined
            ? sentenceUserReplied.freeReply.replyTo
            : undefined;
      }
      // console.log("selectedOption", selectedOption);
      return selectedOption;
    } else {
      //if users msg doesnt have a context id, then he may be replying to the lastbotSentence
      let lastBotSentence = conversation.lastBotSentence;
      let selectedOption: string | undefined =
        lastBotSentence.options !== null
          ? lastBotSentence.options[usersMsgData.usrSentence]
          : lastBotSentence.freeReply !== undefined
          ? lastBotSentence.freeReply.replyTo
          : undefined;
      return selectedOption;
    }
  };
}

export function chatBotDates() {
  return {
    getCurrentDate: () => {
      let dateobj = new Date();
      let arrayOfMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      let month = arrayOfMonths[dateobj.getMonth()];
      let date = dateobj.getDate();
      let year = dateobj.getFullYear();
      let dateOfConversation = `${month}${date}${year}`;
      return dateOfConversation;
    },
    getTimeStamp: () => {
      return new Date();
    },
    getPeriodOfTheDay: () => {
      let date = new Date();
      let dateTime = date.toTimeString();
      let parsedTime = "";
      for (let i = 0; i < 2; i++) {
        parsedTime += dateTime[i];
      }
      let currentHour = parseInt(parsedTime);
      let greeting =
        currentHour <= 12
          ? "Good morning 🌞"
          : currentHour <= 16
          ? "Good afternoon ☀"
          : "Good evening 🌑";
      return greeting;
    },
  };
}
