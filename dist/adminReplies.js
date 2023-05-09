import { deleteConversation } from "./store.js";
const messages = [];
export const adminReplies = {
    Restart: (usersMsgData) => {
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: "your data has been deleted. type hello to start again",
        };
        deleteConversation(usersMsgData.usrPhoneNumber);
        return reply;
    },
};
