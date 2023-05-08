import axios from "axios";
import { Request } from "express";
import { reply } from "./interfaces.js";
const token = process.env.WHATSAPP_TOKEN;
export default async function replySentenceWithText(
  request: Request,
  reply: reply
) {
  let firstMessageHasSent = false;
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
  let response;
  if (typeof reply.message !== "object") {
    response = await axios({
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
  } else if (typeof reply.message === "object") {
    reply.message.forEach(async (message) => {
      if (typeof message !== "object") {
        await axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
          data: {
            messaging_product: "whatsapp",
            context: reply.contextId
              ? {
                  message_id: reply.contextId,
                }
              : undefined,
            to: from,
            text: { body: `${message}` },
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          console.log(token);
          console.log("error replying with text");
        });
      } else if (message.typeOfReply === "interactive") {
        setTimeout(() => {
          console.log("sent out");
          replySentenceWithInteractive(request, message);
        }, 500);
      }
    });
  }
  return response;
}

export async function replySentenceWithInteractive(
  request: Request,
  reply: reply
) {
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from;
  let response = null;
  let buttons = [];
  for (let i in reply.options) {
    buttons.push({
      type: "reply",
      reply: {
        title: reply.options[i].message,
        id: reply.options[i].id,
      },
    });
  }
  await axios({
    method: "POST",
    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: reply.message,
        },
        action: {
          buttons: buttons,
        },
      },
    },
  })
    .then((res) => {
      response = res;
    })
    .catch((e) => {
      console.log("this is the error oo", e);
    });
  return response;
}
