import axios from "axios";
import { Request } from "express";
import { reply } from "./interfaces.js";
const token = process.env.WHATSAPP_TOKEN;
export default async function replySentenceWithText(
  req: Request,
  reply: reply
) {
  let phone_number_id =
    req.body.entry[0].changes[0].value.metadata.phone_number_id;
  let msgID = req.body.entry[0].changes[0].value.messages[0].id;
  let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
  let response = await axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
    data: {
      messaging_product: "whatsapp",
      context: reply.contextId
        ? {
            message_id: reply.contextId,
          }
        : undefined,
      to: from,
      text: { body: `${reply.message}` },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => {
    console.log(token);
    console.log("error replying with text");
  });
  return response;
}
