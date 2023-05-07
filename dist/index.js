var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import dotenv from "dotenv";
import replySentenceWithText from "./sendMessage.js";
dotenv.config();
const app = express();
let port = process.env.PORT;
//create a local store of all conversations
const conversations = [];
console.log("connecticut");
app.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("superman");
    response.status(200);
    response.send("i am connected");
}));
app.get("/webhook", (request, response) => {
    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
     **/
    const verify_token = process.env.VERIFY_TOKEN;
    // Parse params from the webhook verification request
    let mode = request.query["hub.mode"];
    let token = request.query["hub.verify_token"];
    let challenge = request.query["hub.challenge"];
    console.log("john");
    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verify_token) {
            // Respond with 200 OK and challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            response.status(200).send(challenge);
        }
        else {
            // Responds with '403 Forbidden' if verify tokens do not match
            response.sendStatus(403);
        }
    }
    else {
        response.sendStatus(404);
    }
});
app.post("/webhook", (request, response) => {
    console.log("hiii");
    // Parse the request body from the POST
    let body = request.body;
    // Check the Incoming webhook message
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (request.body.object) {
        if (request.body.entry &&
            request.body.entry[0].changes &&
            request.body.entry[0].changes[0] &&
            request.body.entry[0].changes[0].value.messages &&
            request.body.entry[0].changes[0].value.messages[0]) {
            let messageType = request.body.entry[0].changes[0].value.messages[0].type;
            console.log(messageType);
            let phoneNumber = request.body.entry[0].changes[0].value.messages[0].from;
            if (messageType === "text") {
                // extract the message text from the webhook payload
                let recievedText = request.body.entry[0].changes[0].value.messages[0].text.body;
                console.log(recievedText);
                if (recievedText == "hello" || recievedText == "Hello") {
                    console.log("he sent a hello");
                    replySentenceWithText(request, {
                        contextId: "",
                        noReply: true,
                        message: "welcome to my world",
                    });
                }
            }
            else if (messageType === "interactive") {
            }
            else if (messageType == "button") {
            }
        }
        response.sendStatus(200);
    }
    else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        response.sendStatus(404);
    }
});
app.listen(port || 8000, () => {
    console.log("i am listening bro ⚡ on", port);
});
