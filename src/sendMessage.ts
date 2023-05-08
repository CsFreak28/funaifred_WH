import axios, { AxiosResponse } from "axios";
import { Request } from "express";
import { reply } from "./interfaces.js";
import { setConversationID } from "./store.js";
const token = process.env.WHATSAPP_TOKEN;
export default async function replySentenceWithText(
  request: Request,
  reply: reply
) {
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
  let response: any;
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
    let msgID = response.data.messages[0].id;
    console.log("the msgID", msgID);
    setConversationID(from, msgID);
  } else if (typeof reply.message === "object") {
    reply.message.forEach(async (message, i) => {
      if (typeof message !== "object") {
        setTimeout(async () => {
          await axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v15.0/" +
              phone_number_id +
              "/messages",
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
          })
            .then((response) => {
              if (i === reply.message.length - 1) {
                let msgID = response.data.messages[0].id;
                console.log("the msgID", msgID);
                setConversationID(from, msgID);
              }
            })
            .catch(() => {
              console.log(token);
              console.log("error replying with text");
            });
        }, 500 * i);
      } else if (message.typeOfReply === "interactive") {
        setTimeout(async () => {
          console.log("sent out");
          const response: AxiosResponse | string | any =
            await replySentenceWithInteractive(request, message);
          let msgID = response.data.messages[0].id;
          console.log("the msgID", msgID);
          setConversationID(from, msgID);
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
  let response: any | AxiosResponse<any> = "";
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
