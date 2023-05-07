import { paymentReplies } from "./paymentReplies.js";
import replySentenceWithText from "./sendMessage.js";
class ChatBot {
    constructor() {
        this.processKeyword = (message, usrSentence) => {
            //use chatgpt to clean the message and find out it's category, that message belongs to
            let cleanedMessage = message;
            //get the reply of processing the users message
            let resolve = this.chatBotFunctions[cleanedMessage](usrSentence);
            if (resolve === undefined) {
                let noReply = {
                    message: [
                        "I don't quite understand what you want me to do exactly",
                        "did you mean",
                    ],
                    noReply: true,
                    contextId: "",
                };
                return noReply;
            }
            else {
                return resolve;
            }
        };
        this.reply = (request, resolve) => {
            replySentenceWithText(request, resolve);
        };
        this.selectedOption = (conversation, usersMsgData) => {
            if (usersMsgData.usrSentenceID) {
                //if the user's message has an id, check which sentence he was replying to
                let previousSentences = conversation.previousSentences;
                let sentenceUserReplied;
                let selectedOption;
                previousSentences === null || previousSentences === void 0 ? void 0 : previousSentences.forEach((sentence) => {
                    sentence.msgId === usersMsgData.usrSentenceID &&
                        (sentenceUserReplied = sentence);
                });
                if (sentenceUserReplied) {
                    selectedOption =
                        sentenceUserReplied.options !== null
                            ? sentenceUserReplied.options[usersMsgData.usrSentence]
                            : undefined;
                }
                return selectedOption;
            }
            else {
                //if users msg doesnt have a context id, then he may be replying to the lastbotSentence
                let lastBotSentence = conversation.lastBotSentence;
                let selectedOption = lastBotSentence.options !== null
                    ? lastBotSentence.options[usersMsgData.usrSentence]
                    : undefined;
                return selectedOption;
            }
        };
        this.chatBotFunctions = Object.assign({}, paymentReplies);
    }
}
