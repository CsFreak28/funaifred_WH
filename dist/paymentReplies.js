const messages = [];
export const paymentReplies = {
    payments: (sentenceMessage) => {
        let reply = {
            contextId: sentenceMessage.msgId,
            message: "payment about to be made",
            noReply: false,
        };
        return reply;
    },
};