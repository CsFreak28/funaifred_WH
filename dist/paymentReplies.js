const messages = [];
export const paymentReplies = {
    payments: (usersMsgData) => {
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: "payment about to be made",
        };
        return [reply];
    },
    makePayment: (usersMsgData) => {
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: `Here's a list of payments I can help you pay \n additionally I'll store the reciepts for you for easy future retrieval`,
        };
        return [reply];
    },
};
