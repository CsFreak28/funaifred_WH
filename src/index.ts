import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userExistsInDB } from "./db.js";
import {
  textIsAGreeting,
  userExistsInLocalConversations,
} from "./helperFunctions.js";
import bodyParser, { text } from "body-parser";
import replySentenceWithText from "./sendMessage.js";
import { conversation, conversations, usersMsgData } from "./interfaces.js";
import ChatBot from "./chatbot.js";
dotenv.config();
const app: Express = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
let port = process.env.PORT;
console.log("statr");
// create a local store of all conversations
let conversations: conversations = {};
const chatBot = new ChatBot();
console.log("connecticut");
app.get("/", async (request: Request, response: Response) => {
  console.log("superman");
  response.status(200);
  textIsAGreeting("hello");
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
  console.log("hiii");
  // Parse the request body from the POST.
  let body = request.body;
  // Check the Incoming webhook message.
  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages.
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
      let contextId =
        request.body.entry[0].changes[0].value.messages[0].context == undefined
          ? undefined
          : request.body.entry[0].changes[0].value.messages[0].context.id;
      let msgID = request.body.entry[0].changes[0].value.messages[0].id;
      // let usersWhatsappName =
      console.log("this is the message type", messageType);
      if (messageType === "text") {
        // extract the message text from the webhook payload.
        let usersText: string =
          request.body.entry[0].changes[0].value.messages[0].text.body;
        let usersConversation: conversation | undefined =
          userExistsInLocalConversations(phoneNumber, conversations);
        let usersDBRecord =
          usersConversation === undefined
            ? await userExistsInDB(phoneNumber)
            : usersConversation;
        //if usersDBRecord doesn't exist and users local conversation isn't available then user isnt recognized as a student
        console.log("this is the data", usersDBRecord);
        const usrMsgData: usersMsgData = {
          usrSentence: usersText,
          usrSentenceID: msgID,
          sentenceUsrIsReplyingID: contextId,
        };
        if (usersDBRecord === undefined) {
          chatBot.processKeyword("userDoesntExist", usrMsgData);
        } else if (
          usersDBRecord !== undefined &&
          (await textIsAGreeting(usersText))
        ) {
          // replySentenceWithText(request, {
          //   contextId: "",
          // message: "welcome to my world",
          // });
        }
      } else if (messageType === "interactive") {
      } else if (messageType == "button") {
      }
    }
    response.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API.
    response.sendStatus(404);
  }
});
app.get("/testWebhook", (request: Request, response: Response) => {});
app.listen(port || 8000, () => {
  console.log("i am listening bro ⚡ on", port);
});
