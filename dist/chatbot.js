var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { noExistuserReplies } from "./noExistUser.js";
import { paymentReplies } from "./paymentReplies.js";
import { startAndEndReplies } from "./startAndEndReplies.js";
import replySentenceWithText, { replySentenceWithInteractive, } from "./sendMessage.js";
export default class ChatBot {
    constructor() {
        this.processKeyword = (message, usrsMessage) => __awaiter(this, void 0, void 0, function* () {
            //use chatgpt to clean the message and find out it's category, that message belongs to
            let reply;
            if (message !== undefined) {
                let cleanedMessage = typeof message === "string" ? message : message.replyTo;
                //get the reply of processing the users message
                reply = yield this.chatBotFunctions[cleanedMessage](usrsMessage);
            }
            if (message === undefined || reply === undefined) {
                //check if the users message contains certain keywords
                let noReply = {
                    message: ["I don't quite understand what you want me to do"],
                };
                return noReply;
            }
            else {
                return reply;
            }
        });
        this.reply = (request, reply) => {
            if (reply.type === undefined) {
                replySentenceWithText(request, reply);
            }
            else if (reply.type == "interactive") {
                replySentenceWithInteractive(request, reply);
            }
        };
        this.selectedOption = (conversation, usersMsgData) => {
            if (usersMsgData.sentenceUsrIsReplyingID) {
                //if the user's message has an id, check which sentence he was replying to
                let previousSentences = conversation.previousSentences;
                let sentenceUserReplied;
                let selectedOption;
                console.log("previous sentenceID", previousSentences);
                console.log("current sentenceReplyID", usersMsgData.sentenceUsrIsReplyingID);
                previousSentences === null || previousSentences === void 0 ? void 0 : previousSentences.forEach((sentence) => {
                    sentence.msgId === usersMsgData.sentenceUsrIsReplyingID &&
                        (sentenceUserReplied = sentence);
                });
                console.log("sentenceUserReplied", sentenceUserReplied);
                if (sentenceUserReplied) {
                    selectedOption =
                        sentenceUserReplied.options !== null
                            ? sentenceUserReplied.options[usersMsgData.usrSentence]
                            : sentenceUserReplied.freeReply !== undefined
                                ? sentenceUserReplied.freeReply
                                : undefined;
                }
                console.log("selectedOption", selectedOption);
                return selectedOption;
            }
            else {
                //if users msg doesnt have a context id, then he may be replying to the lastbotSentence
                let lastBotSentence = conversation.lastBotSentence;
                let selectedOption = lastBotSentence.options !== null
                    ? lastBotSentence.options[usersMsgData.usrSentence]
                    : lastBotSentence.freeReply !== undefined
                        ? lastBotSentence.freeReply
                        : undefined;
                return selectedOption;
            }
        };
        this.chatBotFunctions = Object.assign(Object.assign(Object.assign({}, paymentReplies), noExistuserReplies), startAndEndReplies);
    }
}
// const chatBotDate = chatBotDates();
// let timeStamp = chatBotDate.getTimeStamp();
// let currentDateOfConv = chatBotDate.getCurrentDate();
export function chatBotDates() {
    return {
        getCurrentDate: () => {
            let dateobj = new Date();
            let arrayOfMonths = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
            ];
            let month = arrayOfMonths[dateobj.getMonth()];
            let date = dateobj.getDate();
            let year = dateobj.getFullYear();
            let dateOfConversation = `${month}${date}${year}`;
            return dateOfConversation;
        },
        getTimeStamp: () => {
            return new Date();
        },
        getPeriodOfTheDay: () => {
            let date = new Date();
            let dateTime = date.toTimeString();
            let parsedTime = "";
            for (let i = 0; i < 2; i++) {
                parsedTime += dateTime[i];
            }
            let currentHour = parseInt(parsedTime);
            let greeting = currentHour <= 12
                ? "Good morning 🌞"
                : currentHour <= 16
                    ? "Good afternoon ☀"
                    : "Good evening 🌑";
            return greeting;
        },
    };
}
