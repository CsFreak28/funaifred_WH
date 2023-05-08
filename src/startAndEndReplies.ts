import {
  sentenceInterface,
  usersMsgData,
  reply,
  conversation,
} from "./interfaces.js";
import { userExistsInDB } from "./db.js";
import { chatBotDates } from "./chatbot.js";
import { addConversation, addLastSentenceToConversation } from "./store.js";
export const startAndEndReplies = {
  introMessage: (usersMsgData: usersMsgData) => {
    //if user did not greet first, "payments??", funny way to start a conversation 😅
    const newChatBotDates = chatBotDates();
    let option1 = "Yes I, am";
    let option2 = "No, I'm not";
    let reply: reply = {
      contextId: usersMsgData.sentenceUsrIsReplyingID,
      message: "Hey there",
    };
    let lastBotSentence: sentenceInterface = {
      msgId: usersMsgData.usrSentenceID,
      options: {
        [option1]: "checkIfUserIsAStudent",
        [option2]: "nonStudents",
      },
    };
    let conversation: conversation = {
      lastChat: newChatBotDates.getCurrentDate(),
      timeOfInteraction: newChatBotDates.getTimeStamp().toDateString(),
      lastBotSentence: lastBotSentence,
      previousSentences: [lastBotSentence],
    };
    addConversation(usersMsgData.usrPhoneNumber, conversation);
    return reply;
  },
  checkIfUserIsAStudent: async (usersMsgData: usersMsgData) => {
    let userProfile = await userExistsInDB(usersMsgData.usrPhoneNumber);
    let reply: reply;
    let lastBotSentence: sentenceInterface;
    let option1 = "Yes";
    let option2 = "No";
    if (userProfile) {
      reply = {
        message: "user document found",
        contextId: usersMsgData.sentenceUsrIsReplyingID,
      };
      lastBotSentence = {
        msgId: usersMsgData.usrSentenceID,
        options: {
          [option1]: "help",
          [option2]: "reConfirmFromCR",
        },
      };
    } else {
      reply = {
        contextId: usersMsgData.sentenceUsrIsReplyingID,
        message: [
          "I just finished searching our database for your information, nothing there about you",
          "give me your real name and i will send it to Benjamin(course rep of 200level computer science) to confirm if you're in his department",
        ],
      };
      lastBotSentence = {
        msgId: usersMsgData.usrSentenceID,
        options: null,
        freeReply: {
          replyTo: "confirmAcctFromCR",
        },
      };
    }

    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return reply;
  },
  nonStudents: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: "I was not built for non students",
      contextId: usersMsgData.sentenceUsrIsReplyingID,
    };
    return reply;
  },
};
