import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userExistsInDB } from "./db.js";
import { getResult } from "./webscraperFunctions.js";
import axios from "axios";
import { txtIsAGreeting } from "./chatGpt.js";
import { storage } from "./firebaseConfig.js";
import { getDownloadURL, ref } from "firebase/storage";
import {
  // conversationsStore,
  getConversation,
  setConversation,
} from "./store.js";
import bodyParser, { text } from "body-parser";
import { conversation, conversations, usersMsgData } from "./interfaces.js";
import ChatBot from "./chatbot.js";
import { getAllRegistration } from "./startAndEndReplies.js";
dotenv.config();
const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
let port = process.env.PORT;
// create a local store of all conversations
// let conversations: conversations = {};
const chatBot = new ChatBot();
app.get("/", async (request: Request, response: Response) => {
  response.status(200);
  response.send("i am connected");
});
app.get("/webhook", (request: Request, response: Response) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;
  // Parse params from the webhook verification request
  let mode = request.query["hub.mode"];
  let token = request.query["hub.verify_token"];
  let challenge = request.query["hub.challenge"];
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      response.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      response.sendStatus(403);
    }
  } else {
    response.sendStatus(404);
  }
});
app.post("/webhook", async (request: Request, response: Response) => {
  // Parse the request body from the POST.
  let body = request.body;
  // Check the Incoming webhook message.
  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages.
  console.log("sticker sent");
  if (request.body.object) {
    if (
      request.body.entry &&
      request.body.entry[0].changes &&
      request.body.entry[0].changes[0] &&
      request.body.entry[0].changes[0].value.messages &&
      request.body.entry[0].changes[0].value.messages[0]
    ) {
      let messageType = request.body.entry[0].changes[0].value.messages[0].type;
      let phoneNumber = request.body.entry[0].changes[0].value.messages[0].from;
      let usersWhatsappName =
        request.body.entry[0].changes[0].value.contacts[0].profile.name;
      let contextId =
        request.body.entry[0].changes[0].value.messages[0].context == undefined
          ? undefined
          : request.body.entry[0].changes[0].value.messages[0].context.id;
      let msgID = request.body.entry[0].changes[0].value.messages[0].id;
      console.log("this is the message type", messageType, "this message");
      console.log("first boy");
      if (messageType === "text") {
        // extract the message text from the webhook payload.
        let usersText: string =
          request.body.entry[0].changes[0].value.messages[0].text.body;
        let usersConversation: conversation | undefined =
          getConversation(phoneNumber);
        let userHasLocalConversation = usersConversation;
        let usersDBRecord =
          usersConversation === undefined
            ? await userExistsInDB(phoneNumber, "conversation")
            : usersConversation;
        usersDBRecord !== undefined &&
          setConversation(phoneNumber, usersDBRecord);
        //if usersDBRecord doesn't exist and users local conversation isn't available then user isnt recognized as a student
        // console.log("userDBrecord", usersDBRecord);
        const usrMsgData: usersMsgData = {
          usersDBRecord: usersDBRecord,
          usrSentence: usersText,
          usrSentenceID: msgID,
          usrPhoneNumber: phoneNumber,
          sentenceUsrIsReplyingID: contextId,
          usersWhatsappName: usersWhatsappName,
          userHasLocalConversation: userHasLocalConversation !== undefined,
        };
        // console.log("conversations", conversationsStore);
        console.log(
          "this user has interacted before",
          usersDBRecord?.interactedBefore
        );
        if (usersDBRecord === undefined || !usersDBRecord.interactedBefore) {
          console.log("hhmm");
          const reply = await chatBot.processKeyword(
            "introMessage",
            usrMsgData
          );
          chatBot.reply(request, reply);
        } else if (usersDBRecord !== undefined && txtIsAGreeting(usersText)) {
          if (usersDBRecord.registered.done) {
            //user is registered and confirmed by his course Rep
            const reply = await chatBot.processKeyword("help", usrMsgData);
            chatBot.reply(request, reply);
          } else {
            //user has not registered
            const reply = await chatBot.processKeyword(
              "incompleteRegistration",
              usrMsgData
            );
            chatBot.reply(request, reply);
          }
        } else {
          //check if the user replied with an option ***
          let selectedOption = chatBot.selectedOption(
            usersDBRecord,
            usrMsgData
          );
          let selectedOptionIsARegistrationReply =
            selectedOption !== undefined &&
            getAllRegistration().includes(selectedOption);
          if (usersDBRecord.registered.done) {
            const reply = await chatBot.processKeyword(
              selectedOption,
              usrMsgData
            );
            chatBot.reply(request, reply);
          } else if (
            !usersDBRecord.registered.done &&
            selectedOptionIsARegistrationReply
          ) {
            const reply = await chatBot.processKeyword(
              selectedOption,
              usrMsgData
            );
            chatBot.reply(request, reply);
          } else {
            //user has not registered
            const reply = await chatBot.processKeyword(
              "incompleteRegistration", //** change this back to incomplete registration */
              usrMsgData
            );
            chatBot.reply(request, reply);
          }
        }
      } else if (messageType === "interactive") {
        let usersText =
          request.body.entry[0].changes[0].value.messages[0].interactive
            .type === "button_reply"
            ? request.body.entry[0].changes[0].value.messages[0].interactive
                .button_reply.title
            : request.body.entry[0].changes[0].value.messages[0].interactive
                .list_reply.title;
        let usersConversation: conversation | undefined =
          getConversation(phoneNumber);
        let userHasLocalConversation = usersConversation;
        let usersDBRecord =
          usersConversation === undefined
            ? await userExistsInDB(phoneNumber, "conversation")
            : usersConversation;
        //if usersDBRecord doesn't exist and users local conversation isn't available then user isnt recognized as a student
        // console.log("this is the data", usersDBRecord);
        const usrMsgData: usersMsgData = {
          usersDBRecord: usersDBRecord,
          usrSentence: usersText,
          usersWhatsappName: usersWhatsappName,
          usrSentenceID: msgID,
          usrPhoneNumber: phoneNumber,
          sentenceUsrIsReplyingID: contextId,
          userHasLocalConversation: userHasLocalConversation !== undefined,
        };
        console.log("this is the userText", usersText);
        // console.log("these are the conversations", conversationsStore);
        //check if the user replied with an option ***
        if (usersDBRecord) {
          let selectedOption = chatBot.selectedOption(
            usersDBRecord,
            usrMsgData
          );
          // console.log(selectedOption);
          const reply = await chatBot.processKeyword(
            selectedOption,
            usrMsgData
          );
          chatBot.reply(request, reply);
        }
      } else if (messageType == "button") {
      }
    }
    response.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API.
    response.sendStatus(404);
  }
});
app.listen(port || 8080, () => {
  console.log("i am listening bro ⚡ on", port);
});
