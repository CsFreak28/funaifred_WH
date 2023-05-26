var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkIfLoginsAreAvailable } from "./db.js";
import { addLastSentenceToConversation, getConversation, pushComboAnswer, } from "./store.js";
const ResultReplies = {
    getResultActionList: (usersMsgData) => {
        let option1 = "GET A SINGLE RESULT";
        let option2 = "GET ALL RESULTS";
        let option3 = "MY CGPA HISTORY";
        let option4 = "TOTAL CGPA";
        let react = {
            typeOfReply: "reaction",
        };
        let lastBotSentence = {
            msgId: "",
            options: {
                [option1]: "getSingleResult_getLevel",
                [option2]: "getAllResults",
                [option3]: "myCgpaHistory",
                [option4]: "myTotalCgpa",
            },
        };
        let reply = {
            typeOfReply: "list",
            id: "23",
            headers: {
                header: "LIST OF RESULT ACTIONS",
                body: `${usersMsgData.usersWhatsappName} This is a list of actions I can perform that are related to your Academic Result`,
                button: "RESULT ACTIONS",
                listItems: [
                    {
                        title: "GET MY RESULT",
                        rows: [
                            {
                                id: "3234",
                                title: option1,
                                description: "I want one of my  academic results",
                            },
                            {
                                id: "4344",
                                title: option2,
                                description: "I want all my academic results",
                            },
                        ],
                    },
                    {
                        title: "MY CGPA",
                        rows: [
                            {
                                id: "32164",
                                title: option3,
                                description: "My CGPA's from 100 level till now",
                            },
                            {
                                id: "3264",
                                title: option4,
                                description: "My accumulated CGPA",
                            },
                        ],
                    },
                ],
            },
        };
        // console.log("get result action list");
        addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
        return [reply];
    },
    getSingleResult_getLevel: (usersMsgData) => {
        var _a;
        let conversation = getConversation(usersMsgData.usrPhoneNumber);
        let semester = 1;
        let lastBotSentence = {
            msgId: "",
            options: null,
            freeReply: {
                replyTo: "getSingleResult_getSemester",
            },
        };
        let level = (_a = conversation === null || conversation === void 0 ? void 0 : conversation.studentInfo) === null || _a === void 0 ? void 0 : _a.level;
        // console.log("this is the convo", conversation);
        let levelNumber = level !== undefined ? parseInt(level) : 0;
        let listItems = [
            {
                title: "PICK A LEVEL",
                rows: [],
            },
        ];
        // console.log(levelNumber);
        // console.log("charmain");
        for (let i = 100; i <= levelNumber; i += 100) {
            // console.log(i, levelNumber);
            let rowItem = {
                title: `${i} LEVEL`,
                id: `${i}`,
            };
            listItems[0].rows.push(rowItem);
        }
        let reply = {
            typeOfReply: "list",
            id: "uwa54",
            headers: {
                header: "SELECT RESULT",
                body: "Click the button below to select the result you want to get",
                button: "SELECT RESULT",
                listItems: listItems,
            },
        };
        let secondReply = {
            message: `${listItems.length} items in list`,
            contextId: usersMsgData.usrSentenceID,
        };
        addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
        return [secondReply, reply];
    },
    getSingleResult_getSemester: (usersMsgData) => {
        let comboAnswerToPush = usersMsgData.usrSentence.slice(0, 3);
        pushComboAnswer(usersMsgData.usrPhoneNumber, comboAnswerToPush);
        console.log("inside here");
        let option1 = "FIRST SEMESTER";
        let option2 = "SECOND SEMESTER";
        let nextAction = "getSingleResult_whichFormatOfResult";
        let lastBotSentence = {
            msgId: "",
            options: {
                [option1]: nextAction,
                [option2]: nextAction,
            },
        };
        let reply = {
            typeOfReply: "interactive",
            message: [
                {
                    typeOfReply: "interactive",
                    message: "Which semester's result would you like to see",
                    options: {
                        firstButton: {
                            typeOfReply: "interactive",
                            message: option1,
                            id: "12",
                        },
                        secondButton: {
                            typeOfReply: "interactive",
                            message: option2,
                            id: "21",
                        },
                    },
                },
            ],
            contextId: usersMsgData.usrSentenceID,
        };
        addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
        return [reply];
    },
    getSingleResult_whichFormatOfResult: (usersMsgData) => {
        console.log("blablablablablablablablalblalblalb");
        pushComboAnswer(usersMsgData.usrPhoneNumber, usersMsgData.usrSentence);
        let option1 = "PDF";
        let option2 = "EMOJI'S";
        let lastBotSentence = {
            msgId: "",
            options: {
                [option1]: "getSingleResult_getLogins",
                [option2]: "getSingleResult_getLogins",
            },
        };
        let reply = {
            typeOfReply: "interactive",
            message: [
                {
                    message: "In what format would you like to get your result ?",
                    typeOfReply: "interactive",
                    options: {
                        firstButton: {
                            typeOfReply: "interactive",
                            id: "10",
                            message: option1,
                        },
                        secondButton: {
                            typeOfReply: "interactive",
                            id: "11",
                            message: option2,
                        },
                    },
                },
            ],
            contextId: usersMsgData.usrSentenceID,
        };
        addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
        return [reply];
    },
    getSingleResult_getLogins: (usersMsgData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let usrsLogins = yield checkIfLoginsAreAvailable(`${(_a = usersMsgData.usersDBRecord) === null || _a === void 0 ? void 0 : _a.studentInfo.dept}`, usersMsgData.usrPhoneNumber);
        let reply = {
            message: "here's your result",
            contextId: usersMsgData.usrSentenceID,
        };
        if (usrsLogins) {
            reply = {
                message: "please be patient",
            };
        }
        console.log("get the result");
        return [reply];
    }),
    getAllResults: (usersMsgData) => {
        let reply = {
            message: "feature is working",
            contextId: usersMsgData.usrSentenceID,
        };
        return [reply];
    },
    myCgpaHistory: (usersMsgData) => {
        let reply = {
            message: "feature is working",
            contextId: usersMsgData.usrSentenceID,
        };
        return [reply];
    },
    myTotalCgpa: (usersMsgData) => {
        let reply = {
            message: "feature is working",
            contextId: usersMsgData.usrSentenceID,
        };
        return [reply];
    },
};
const paymentReplies = {
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
            message: `Here's a list of payments I can help you make \n additionally I'll store the reciepts for you for easy future retrieval`,
        };
        return [reply];
    },
};
export const webscraperReplies = Object.assign(Object.assign({}, ResultReplies), paymentReplies);
