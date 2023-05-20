import {
  listReply,
  reply,
  sentenceInterface,
  usersMsgData,
  reaction,
} from "./interfaces.js";
import {
  addLastSentenceToConversation,
  clearComboAnswers,
  getComboAnswer,
  getConversation,
  pushComboAnswer,
} from "./store.js";
const ResultReplies = {
  getResultActionList: (usersMsgData: usersMsgData) => {
    let option1 = "GET A SINGLE RESULT";
    let option2 = "GET ALL RESULTS";
    let option3 = "MY CGPA HISTORY";
    let option4 = "TOTAL CGPA";
    let react: reaction = {
      typeOfReply: "reaction",
    };
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {
        [option1]: "getSingleResult_getLevel",
        [option2]: "getAllResults",
        [option3]: "myCgpaHistory",
        [option4]: "myTotalCgpa",
      },
    };
    let reply: listReply = {
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
  getSingleResult_getLevel: (usersMsgData: usersMsgData) => {
    let conversation = getConversation(usersMsgData.usrPhoneNumber);
    let semester = 1;
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: null,
      freeReply: {
        replyTo: "getSingleResult_getSemester",
      },
    };
    let level = conversation?.studentInfo?.level;
    // console.log("this is the convo", conversation);
    let levelNumber = level !== undefined ? parseInt(level) : 0;
    let listItems: any = [
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
    let reply: listReply = {
      typeOfReply: "list",
      id: "uwa54",
      headers: {
        header: "SELECT RESULT",
        body: "Click the button below to select the result you want to get",
        button: "SELECT RESULT",
        listItems: listItems,
      },
    };
    let secondReply: reply = {
      message: `${listItems.length} items in list`,
      contextId: usersMsgData.usrSentenceID,
    };
    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return [secondReply, reply];
  },
  getSingleResult_getSemester: (usersMsgData: usersMsgData) => {
    let comboAnswerToPush = usersMsgData.usrSentence.slice(0, 3);
    pushComboAnswer(usersMsgData.usrPhoneNumber, comboAnswerToPush);
    console.log("inside here");
    let option1 = "FIRST SEMESTER";
    let option2 = "SECOND SEMESTER";
    let nextAction = "getSingleResult_getResult";
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {
        [option1]: nextAction,
        [option2]: nextAction,
      },
    };
    let reply: reply = {
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
  whatFormat: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: [
        {
          message: "In what format would you like to get your result",
          typeOfReply: "interactive",
          options: {
            firstButton: {
              typeOfReply: "interactive",
              id: "10",
              message: "PDF",
            },
            secondButton: {
              typeOfReply: "interactive",
              id: "10",
              message: "EMOJI's REPRESENTATION",
            },
          },
        },
      ],
    };
    return [reply];
  },
  getSingleResult_getResult: (usersMsgData: usersMsgData) => {
    pushComboAnswer(usersMsgData.usrPhoneNumber, usersMsgData.usrSentence);
    console.log("get the result");
    let reply: reply = {
      message: "here's your result",
      contextId: usersMsgData.usrSentenceID,
    };
    return [reply];
  },
  getAllResults: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: "feature is working",
      contextId: usersMsgData.usrSentenceID,
    };
    return [reply];
  },
  myCgpaHistory: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: "feature is working",
      contextId: usersMsgData.usrSentenceID,
    };
    return [reply];
  },
  myTotalCgpa: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: "feature is working",
      contextId: usersMsgData.usrSentenceID,
    };
    return [reply];
  },
};
const paymentReplies = {
  payments: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      contextId: usersMsgData.sentenceUsrIsReplyingID,
      message: "payment about to be made",
    };
    return [reply];
  },
  makePayment: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      contextId: usersMsgData.sentenceUsrIsReplyingID,
      message: `Here's a list of payments I can help you make \n additionally I'll store the reciepts for you for easy future retrieval`,
    };
    return [reply];
  },
};
export const webscraperReplies = {
  ...ResultReplies,
  ...paymentReplies,
};
