import { reply, conversation, sentenceInterface } from "./interfaces.js";
const messages = [];
export const paymentReplies = {
  payments: (sentenceMessage: sentenceInterface) => {
    let reply: reply = {
      contextId: sentenceMessage.msgId,
      message: "payment about to be made",
    };
    return reply;
  },
};
