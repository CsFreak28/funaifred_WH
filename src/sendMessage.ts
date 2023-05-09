import axios, { AxiosError, AxiosResponse } from "axios";
import { Request } from "express";
import { reply, listReply } from "./interfaces.js";
import { setConversationID } from "./store.js";
const token = process.env.WHATSAPP_TOKEN;
export default async function replySentenceWithText(
  request: Request,
  reply: reply
) {
  markMessageAsRead(request);
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
    // console.log("the msgID", msgID);
    setConversationID(from, msgID);
  } else if (typeof reply.message === "object") {
    let firstMessage = reply.message[0];
    let secondMessage = reply.message[1];
    await axios({
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
        text: { body: `${firstMessage}` },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        let msgID = response.data.messages[0].id;
        if (typeof secondMessage === "object") {
          await axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v15.0/" +
              phone_number_id +
              "/messages",
            data: {
              messaging_product: "whatsapp",
              context: {
                message_id: msgID,
              },
              to: from,
              text: { body: `${secondMessage.message}` },
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }
      })
      .catch(() => {
        console.log(token);
        console.log("error replying with text");
      });
  }
  return response;
}
export async function replySentenceWithInteractive(
  request: Request,
  reply: reply
) {
  markMessageAsRead(request);
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

export async function replySentenceWithList(
  request: Request,
  listReply: listReply
) {
  let msgID = request.body.entry[0].changes[0].value.messages[0].id;
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from;

  let response = await axios({
    method: "POST",
    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: listReply.headers.header,
        },
        body: {
          text: listReply.headers.body,
        },
        action: {
          button: listReply.headers.button,
          sections: listReply.headers.listItems,
        },
      },
    },
  }).catch((e) => {
    console.log("this is the sendList Error", e);
  });
  return response;
}

async function markMessageAsRead(request: Request) {
  let msgID = request.body.entry[0].changes[0].value.messages[0].id;
  console.log(msgID);
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  var data = JSON.stringify({
    messaging_product: "whatsapp",
    status: "read",
    message_id: msgID,
  });

  var config = {
    method: "POST",
    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  };

  await axios(config)
    .then(function (response: AxiosResponse) {
      console.log("mark message as read, complete");
    })
    .catch(function (error: AxiosError) {
      console.log(error);
    });
}
