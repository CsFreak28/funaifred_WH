const messages = [];
export const noExistuserReplies = {
    userDoesntExist: (usrMsgData) => {
        let reply = {
            contextId: usrMsgData.sentenceUsrIsReplyingID,
            message: [
                "I'm so sorry, but i couldn't get your data from the records",
                "Are you a student of F.U.N.A.I ?",
            ],
        };
        return reply;
    },
};
