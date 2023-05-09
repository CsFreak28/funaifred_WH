var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateMessage } from "./chatGpt.js";
import { userExistsInDB } from "./db.js";
import { chatBotDates } from "./chatbot.js";
import { addConversation, addLastSentenceToConversation } from "./store.js";
let emojis = ["❤️", "👑", "💫", "👋", "💯", "🌈"];
export const startAndEndReplies = {
    introMessage: (usersMsgData) => __awaiter(void 0, void 0, void 0, function* () {
        //if user did not greet first, "payments??", funny way to start a conversation 😅
        const newChatBotDates = chatBotDates();
        let option1 = "Yes I, am";
        let option2 = "No, I'm not";
        let randomEmoji = emojis[Math.floor(Number(Math.random) * emojis.length)];
        let greetingMessage = yield generateMessage(`write a short 50 words introduction message from a chatbot named Fred to it's master named ${usersMsgData.usersWhatsappName}, telling him that he is a chatbot built to serve students of Federal University Ndufu Alike Ikwo, add this ${randomEmoji} emoji after metioning ${usersMsgData.usersWhatsappName}'s name and don't ask ${usersMsgData.usersWhatsappName} how you can help him`);
        let reply = {
            contextId: usersMsgData.sentenceUsrIsReplyingID,
            message: [
                greetingMessage,
                {
                    message: "But first of all, are you a student of FUNAI?",
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
    }),
    checkIfUserIsAStudent: (usersMsgData) => __awaiter(void 0, void 0, void 0, function* () {
        let userProfile = yield userExistsInDB(usersMsgData.usrPhoneNumber);
        let reply;
        let lastBotSentence;
        let option1 = "Yes ✅";
        let option2 = "No ❌";
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
                    "I just finished searching my database for your information, i did'nt find anything 😔.",
                    "but you can give me your *LEVEL* and *DEPARTMENT* and i will confirm from the course rep if you're in the department \n write the department and level in this format \n *Computer science 100 level* or \n *CSC 100* or \n *I am in computer science department, 100 lvl* \n basically anyhow you like 🤗",
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
    confirmAcctFromCR: (usersMsgData) => {
        let courseRepsName = "Benjamin";
        let deptName = "CSC";
        let reply = {
            message: [
                `Your fullname *${usersMsgData}* will be sent to *${courseRepsName}* \n to confirm that you are a student of ${deptName}`,
            ],
            contextId: usersMsgData.usrSentenceID,
        };
        return reply;
    },
    nonStudents: (usersMsgData) => {
        let reply = {
            message: "I was not built for non students",
            contextId: usersMsgData.usrSentenceID,
        };
        return reply;
    },
};
