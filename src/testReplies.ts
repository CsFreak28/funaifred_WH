// import {
//   reply,
//   sentenceInterface,
//   usersMsgData,
//   conversation,
// } from "./interfaces.js";
// import {
//   addLastSentenceToConversation,
//   getComboAnswer,
//   pushComboAnswer,
// } from "./store.js";
// import { chatBotDates } from "./chatbot.js";
// import { sendResult } from "./sendMessage.js";
// import { addConversation } from "./store.js";
// import { getResult } from "./webscraperFunctions.js";
// export const testReplies = {
//   test: (usersMsgData: usersMsgData) => {
//     let lastBotSentence: sentenceInterface = {
//       msgId: "",
//       options: null,
//       freeReply: {
//         replyTo: "testGetPassword",
//       },
//     };
//     let reply: reply = {
//       message:
//         "Okay let's test the result feature \n please send your FUNAI portal username",
//     };
//     const newChatBotDates = chatBotDates();
//     let conversation: conversation = {
//       // registered:
//       lastChat: newChatBotDates.getCurrentDate(),
//       timeOfInteraction: newChatBotDates.getTimeStamp().toDateString(),
//       lastBotSentence: lastBotSentence,
//       previousSentences: [lastBotSentence],
//     };
//     addConversation(usersMsgData.usrPhoneNumber, conversation);
//     return [reply];
//   },
//   testGetPassword: (usersMsgData: usersMsgData) => {
//     pushComboAnswer(usersMsgData.usrPhoneNumber, usersMsgData.usrSentence);
//     const lastBotSentence: sentenceInterface = {
//       msgId: "",
//       options: null,
//       freeReply: {
//         replyTo: "testGetResult",
//       },
//     };
//     let reply: reply = {
//       message: "Please send your FUNAI portal password next",
//     };
//     addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
//     return [reply];
//   },
//   testGetResult: async (usersMsgData: usersMsgData) => {
//     let comboAnswer = getComboAnswer(usersMsgData.usrPhoneNumber);
//     console.log("this is the combo answer", comboAnswer);
//     let reply: reply = {
//       typeOfReply: "document",
//       message: `${usersMsgData.usersWhatsappName}, please be patient let me fetch your result`,
//     };
//     let userDetail = {
//       userName: comboAnswer,
//       password: usersMsgData.usrSentence,
//     };
//     await getResult(userDetail, 4, 1);
//     // addLastSentenceToConversation(usersMsgData.usrPhoneNumber, lastBotSentence);
//     return [reply];
//   },
// };
