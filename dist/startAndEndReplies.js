var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userExistsInDB } from "./db.js";
import { chatBotDates } from "./chatbot.js";
import { addConversation, addLastSentenceToConversation } from "./store.js";
export const startAndEndReplies = {
    introMessage: (usersMsgData) => {
        //if user did not greet first, "payments??", funny way to start a conversation 😅
        const newChatBotDates = chatBotDates();
        let option1 = "Yes I, am";
        let option2 = "No, I'm not";
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: [
                `Hey there ${usersMsgData.usersWhatsappName}`,
                {
                    message: "Are you a student of FUNAI?",
                    typeOfReply: "interactive",
                    options: {
                        firstButtonText: {
                            message: option1,
                            id: "110",
                        },
                        secondButtonText: {
                            message: option2,
                            id: "120",
                        },
                    },
                },
            ],
        };
        let lastBotSentence = {
            msgId: "",
            options: {
                [option1]: "checkIfUserIsAStudent",
                [option2]: "nonStudents",
            },
        };
        let conversation = {
            lastChat: newChatBotDates.getCurrentDate(),
            timeOfInteraction: newChatBotDates.getTimeStamp().toDateString(),
            lastBotSentence: lastBotSentence,
            previousSentences: [lastBotSentence],
        };
        addConversation(usersMsgData.usrPhoneNumber, conversation);
        return reply;
    },
    checkIfUserIsAStudent: (usersMsgData) => __awaiter(void 0, void 0, void 0, function* () {
        let userProfile = yield userExistsInDB(usersMsgData.usrPhoneNumber);
        let reply;
        let lastBotSentence;
        let option1 = "Yes";
        let option2 = "No";
        if (userProfile) {
            reply = {
                message: "user document found",
                contextId: usersMsgData.usrSentenceID,
            };
            lastBotSentence = {
                msgId: "",
                options: {
                    [option1]: "help",
                    [option2]: "reConfirmFromCR",
                },
            };
        }
        else {
            reply = {
                contextId: usersMsgData.usrSentenceID,
                message: [
                    "I just finished searching our database for your information, nothing there about you",
                    "give me your real name and i will send it to Benjamin(course rep of 200level computer science) to confirm if you're in his department",
                ],
            };
            lastBotSentence = {
                msgId: "",
                options: null,
                freeReply: {
                    replyTo: "confirmAcctFromCR",
                },
            };
        }
        addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
        return reply;
    }),
    nonStudents: (usersMsgData) => {
        let reply = {
            message: "I was not built for non students",
            contextId: usersMsgData.usrSentenceID,
        };
        return reply;
    },
};
