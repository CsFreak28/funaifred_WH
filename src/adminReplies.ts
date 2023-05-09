import {
  reply,
  conversation,
  sentenceInterface,
  usersMsgData,
} from "./interfaces.js";
const messages = [];
export const adminReplies = {
  Restart: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      contextId: usersMsgData.sentenceUsrIsReplyingID,
      message: "your data has been deleted. type hello to start again",
    };
    return reply;
  },
};
