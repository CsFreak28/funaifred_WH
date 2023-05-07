const messages = [];
export const paymentReplies = {
    payments: (usersMsgData) => {
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: "payment about to be made",
        };
        return reply;
    },
};
