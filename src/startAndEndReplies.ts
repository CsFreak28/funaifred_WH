import {
  sentenceInterface,
  usersMsgData,
  reply,
  conversation,
  listReply,
} from "./interfaces.js";
import { generateMessage, whichDepartmentAndLevel } from "./chatGpt.js";
import { userExistsInDB } from "./db.js";
import { chatBotDates } from "./chatbot.js";
import {
  addConversation,
  addLastSentenceToConversation,
  updateIncompleteRegReason,
  updateUserDetailInConversation,
  userIsNowRegistered,
} from "./store.js";
import { extractDepartmentAndLevel } from "./helperFunctions.js";
let emojis = ["❤️", "👑", "💫", "👋", "💯", "🌈"];
export const startAndEndReplies = {
  introMessage: async (usersMsgData: usersMsgData) => {
    //if user did not greet first, "payments??", funny way to start a conversation 😅
    const newChatBotDates = chatBotDates();
    let option1 = "Yes, I am";
    let option2 = "No, I'm not";
    let randomEmoji = emojis[Math.floor(Number(Math.random) * emojis.length)];
    let greetingMessage = await generateMessage(
      `write a short 50 words introduction message from a chatbot named Fred to it's master named ${usersMsgData.usersWhatsappName}, telling him that he is a chatbot built to serve students of Federal University Ndufu Alike Ikwo, add this ${randomEmoji} emoji after metioning ${usersMsgData.usersWhatsappName}'s name and don't ask ${usersMsgData.usersWhatsappName} how you can help him`
    );
    let reply: reply = {
      contextId: usersMsgData.usrSentenceID,
      message: [
        greetingMessage,
        {
          message: "But first of all, are you a student of FUNAI?",
          typeOfReply: "interactive",
          options: {
            firstButtonText: {
              typeOfReply: "interactive",
              message: option1,
              id: "110",
            },
            secondButtonText: {
              typeOfReply: "interactive",
              message: option2,
              id: "120",
            },
          },
        },
      ],
    };
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {
        [option1]: "checkIfUserIsAStudent",
        [option2]: "nonStudents",
      },
    };
    let conversation: conversation = {
      // registered:
      lastChat: newChatBotDates.getCurrentDate(),
      timeOfInteraction: newChatBotDates.getTimeStamp().toDateString(),
      lastBotSentence: lastBotSentence,
      previousSentences: [lastBotSentence],
    };
    addConversation(usersMsgData.usrPhoneNumber, conversation);
    return [reply];
  },
  checkIfUserIsAStudent: async (usersMsgData: usersMsgData) => {
    let userProfile = await userExistsInDB(usersMsgData.usrPhoneNumber);
    let reply: reply;
    let lastBotSentence: sentenceInterface;
    let option1 = "Yes ✅";
    let option2 = "No ❌";
    if (userProfile) {
      reply = {
        message: "user document found just now",
        contextId: usersMsgData.usrSentenceID,
      };
      lastBotSentence = {
        msgId: "",
        options: {
          [option1]: "help",
          [option2]: "reConfirmFromCR",
        },
      };
      userIsNowRegistered(usersMsgData.usrPhoneNumber);
    } else {
      reply = {
        contextId: usersMsgData.usrSentenceID,
        message: [
          "I just finished searching my database for your information, i didn't find anything 😔.",
          "but you can give me your *LEVEL* and *DEPARTMENT* and i will confirm from the course rep if you're in the department, \n write the department and level in this format \n *Computer science 100 level* or \n *CSC 100* or \n *I am in computer science department, 100 lvl* \n basically send it to me anyhow you like 🤗.",
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
    return [reply];
  },
  confirmAcctFromCR: async (usersMsgData: usersMsgData) => {
    let deptAndLevel = await whichDepartmentAndLevel(usersMsgData.usrSentence);
    //there is no department like that
    //there is no level like that
    let courseRepsName = "Benjamin";
    let deptName = "CSC";
    let option1 = "Yes ✅";
    let option2 = "No ❌";
    let reply: reply;
    let lastBotSentence: sentenceInterface;
    let departmentInfo = extractDepartmentAndLevel(deptAndLevel);
    if (deptAndLevel === "noDepartment" || !departmentInfo.deptExists) {
      console.log("johson");
      let noLevelMsg =
        departmentInfo.level === ""
          ? "You didn't send your level 😅, \n Please send the name of your department and level"
          : `No level like ${departmentInfo.level} exists in ${
              departmentInfo.deptFullName !== ""
                ? departmentInfo.deptFullName
                : "the department you sent."
            } 😅`;
      reply = {
        message: departmentInfo.deptExists
          ? "No department like that exists in FUNAI, \n or in my database at least😅\n please send the name of your department and level"
          : noLevelMsg,
      };
      lastBotSentence = {
        msgId: "",
        options: null,
        freeReply: {
          replyTo: "confirmAcctFromCR",
        },
      };
    } else {
      reply = {
        message: [
          `Your name *"${usersMsgData.usersWhatsappName}"* will be sent to *${courseRepsName}*, \n (The Course Rep of ${departmentInfo.deptFullName} department) \n to confirm that you are in ${departmentInfo.dept} department`,
          {
            message:
              "Would you like to change the name sent to your Course Rep?",
            typeOfReply: "interactive",
            options: {
              firstbutton: {
                typeOfReply: "interactive",
                message: option1,
                id: "230",
              },
              secondbutton: {
                typeOfReply: "interactive",
                message: option2,
                id: "220",
              },
            },
          },
        ],
        contextId: usersMsgData.usrSentenceID,
      };
      lastBotSentence = {
        msgId: "",
        options: {
          [option1]: "changeCourseRepConfirmDetails",
          [option2]: "sentToCourseRep",
        },
      };
    }
    updateUserDetailInConversation(usersMsgData.usrPhoneNumber, {
      dept: deptName,
      courseRep: courseRepsName,
    });

    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return [reply];
  },
  confirmNameFromCR: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: `Your name ${usersMsgData.usrSentence} has been sent to the course Rep for confirmation \n ${usersMsgData.usersWhatsappName} please be patient ⏳`,
      contextId: usersMsgData.usrSentenceID,
    };
    return [reply];
  },
  changeCourseRepConfirmDetails: (usersMsgData: usersMsgData) => {
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: null,
      freeReply: {
        replyTo: "confirmNameFromCR",
      },
    };
    let reply: reply = {
      message: "send the name you want to be sent to your Course Rep",
      contextId: usersMsgData.usrSentenceID,
    };
    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return [reply];
  },
  nonStudents: (usersMsgData: usersMsgData) => {
    //create a command here
    let reply: reply = {
      message:
        "Currently i don't have any features for non students \n But I'm sure in a future update i will have alot 💯",
      contextId: usersMsgData.usrSentenceID,
    };
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {},
    };
    return [reply];
    // addLastSentenceToConversation('')
  },
  incompleteRegistration: (usersMsgData: usersMsgData) => {
    let option1 = "Yes, I am";
    let option2 = "No, I'm not";
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {
        [option1]: "checkIfUserIsAStudent",
        [option2]: "nonStudents",
      },
    };
    let reply: reply = {
      message: [
        `Hi! ${usersMsgData.usersWhatsappName} \n Please complete your registration so that I can assist you 🤖`,
        {
          message: "Are you a student of FUNAI ?",
          typeOfReply: "interactive",
          options: {
            firstButton: {
              typeOfReply: "interactive",
              message: "Yes, I am",
              id: "23",
            },
            secondButton: {
              typeOfReply: "interactive",
              message: "No, I'm not",
              id: "24",
            },
          },
        },
      ],
      contextId: usersMsgData.usrSentenceID,
    };
    if (
      usersMsgData.usersDBRecord !== undefined &&
      usersMsgData.usersDBRecord.registered !== undefined &&
      usersMsgData.usersDBRecord.registered.process === "courseRepConfirm"
    ) {
      reply = {
        contextId: usersMsgData.usrSentenceID,
        message: `You haven't been confirmed by ${usersMsgData.usersDBRecord.userDetails.courseRep} \n as a member of ${usersMsgData.usersDBRecord.userDetails.dept} \n ${usersMsgData.usersWhatsappName} please be patient ⏳`,
      };
      lastBotSentence = {
        msgId: "",
        options: {
          command: "doNotReply",
        },
      };
    }
    //addLast sentence to Conversation
    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return [reply];
  },
  sentToCourseRep: (usersMsgData: usersMsgData) => {
    let reply: reply = {
      message: `Your name has been sent to the course Rep for confirmation \n ${usersMsgData.usersWhatsappName} please be patient ⏳.`,
    };
    updateIncompleteRegReason(usersMsgData.usrPhoneNumber);
    return [reply];
  },
  help: (usersMsgData: usersMsgData) => {
    //--> get department of user
    //--> check if user has paid
    let option1 = "Make A Payment";
    let option2 = "Payment Reciepts";
    let option3 = "Course Information";
    let option4 = "School Information";
    let option5 = "Take Attendance";
    let option6 = "Attendance Record";
    let option7 = "My Result";
    let option8 = "Course Material";
    let lastBotSentence: sentenceInterface = {
      msgId: "",
      options: {
        [option1]: "makePayment",
        [option2]: "getReciepts",
        [option3]: "courseInformation",
        [option4]: "schoolInformation",
        [option5]: "takeAttendance",
        [option6]: "attendanceRecord",
        [option7]: "getResult",
        [option8]: "getCourseMaterial",
      },
    };
    let reply: reply = {
      message: [
        `Hi ${usersMsgData.usersWhatsappName}😊! \n How can I assist you today?`,
      ],
    };
    let secondReply: listReply = {
      message: "This is the list of things I can help you do.",
      id: "134",
      typeOfReply: "list",
      headers: {
        header: "LIST OF FEATURES",
        body: "Click the *BUTTON* below to see the things \n I can help you do in *FUNAI*.",
        button: "LIST OF FEATURES 📃",
        listItems: [
          {
            title: "PAYMENTS 💰",
            rows: [
              {
                title: "Make A Payment",
                description: "I want to make a payment.",
                id: "23",
              },
              {
                title: "Payment Reciepts",
                description: "I want to get the reciept of a payment I made.",
                id: "24",
              },
            ],
          },
          {
            title: "INFORMATION 📰",
            rows: [
              {
                title: "Course Information",
                description:
                  "I want to get information on things happening in CSC department",
                id: "25",
              },
              {
                title: "School Information",
                description:
                  "I want to get information on things happening in School",
                id: "26",
              },
            ],
          },
          {
            title: "ATTENDANCE (✨)",
            rows: [
              {
                title: "Take Attendance",
                description: "Take my attendance",
                id: "30",
              },
              {
                title: "Attendance Record",
                description: "Get my attendance record",
                id: "31",
              },
            ],
          },
          {
            title: "ACADEMIC STUFF",
            rows: [
              {
                title: "My Result",
                description: "Get My Result",
                id: "32",
              },
              {
                title: "Course Material",
                description: "I need a course material",
                id: "33",
              },
            ],
          },
        ],
      },
    };
    addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
    return [reply, secondReply];
  },
};

export function getAllRegistration() {
  let registrationReplies = [];
  for (let i in startAndEndReplies) {
    if (i !== "help") {
      registrationReplies.push(i);
    }
  }
  return registrationReplies;
}
