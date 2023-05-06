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
dotenv.config();
const app = express();
let port = process.env.PORT;
app.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
    console.log(token);
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
app.listen(port || 8000, () => {
    console.log("i am listening bro ⚡ on", port);
});
