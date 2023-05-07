import {
  reply,
  conversation,
  sentenceInterface,
  usersMsgData,
} from "./interfaces.js";
const messages = [];
export const paymentReplies = {
  payments: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      contextId: usersMsgData.sentenceUsrIsReplyingID,
      message: "payment about to be made",
    };
    return reply;
  },
};
