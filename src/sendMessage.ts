import axios, { AxiosError, AxiosResponse } from "axios";
import { Request } from "express";
import { reply, listReply } from "./interfaces.js";
import { setConversationID } from "./store.js";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebaseConfig.js";
export default async function replySentenceWithText(
  request: Request,
  reply: reply
) {
  const token = process.env.WHATSAPP_TOKEN;
  markMessageAsRead(request);
  // le.log("this is the token", token);
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
      // console.log(token);
      console.log("error replying with text");
    });
    let msgID = response.data.messages[0].id;
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
        console.log("#debug 0: process entered the .then block");
        let msgID = response.data.messages[0].id;
        setConversationID(from, msgID);
        if (secondMessage !== undefined) {
          console.log("#debug 1 :second message not undefined");
          let contextID = response.data.messages[0].id;
          if (typeof secondMessage === "object") {
            if (
              secondMessage.options !== undefined &&
              secondMessage.options[Object.keys(secondMessage.options)[0]]
                .typeOfReply === "interactive"
            ) {
              console.log("#debug 2 :second message is an interactive Message");
              let response = await replySentenceWithInteractive(
                request,
                secondMessage
              );
              let msgID = response.data.messages[0].id;
              setConversationID(from, msgID);
            }
          } else {
            let response = await axios({
              method: "POST", // Required, HTTP method, a string, e.g. POST, GET
              url:
                "https://graph.facebook.com/v15.0/" +
                phone_number_id +
                "/messages",
              data: {
                messaging_product: "whatsapp",
                context: {
                  message_id: contextID,
                },
                to: from,
                text: { body: `${secondMessage}` },
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            let msgID2 = response.data.messages[0].id;
            setConversationID(from, msgID2);
          }
        }
      })
      .catch(() => {});
  }
  return response;
}
export async function replySentenceWithInteractive(
  request: Request,
  reply: reply
) {
  const token = process.env.WHATSAPP_TOKEN;
  console.log("this is the interactive", reply);
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
      let msgID = response.data.messages[0].id;
      setConversationID(from, msgID);
      console.log("SET convo id", msgID);
    })
    .catch((e) => {
      console.log("this is the error oo", e.response.data.error);
    });
  return response;
}

export async function replySentenceWithList(
  request: Request,
  listReply: listReply
) {
  const token = process.env.WHATSAPP_TOKEN;
  console.log("debug #5 : process entered list");
  markMessageAsRead(request);
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from;
  let response: any = "";
  response = await axios({
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
  })
    .then((response) => {
      console.log("sendList was succesful");
      let msgID = response.data.messages[0].id;
      setConversationID(from, msgID);
    })
    .catch((e) => {
      console.log("this is the sendList Error", e.response.data.error);
    });
  return response;
}
export async function sendResult(request: Request) {
  const token = process.env.WHATSAPP_TOKEN;
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let from = request.body.entry[0].changes[0].value.messages[0].from;
  getDownloadURL(ref(storage, "Results2.pdf")).then((url) => {
    axios({
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
        type: "document",
        document: {
          link: url,
        },
      },
    }).catch((e) => {
      console.log(e.response.data);
    });
  });
}
export async function reactToMessage(request: Request, emoji: string) {
  const token = process.env.WHATSAPP_TOKEN;
  let from = request.body.entry[0].changes[0].value.messages[0].from;
  let msgID = request.body.entry[0].changes[0].value.messages[0].id;
  let phone_number_id =
    request.body.entry[0].changes[0].value.metadata.phone_number_id;
  let data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "reaction",
    reaction: {
      message_id: msgID,
      emoji: emoji,
    },
  };
  await axios({
    method: "POST",
    url: "https://graph.facebook.com/v15.0/" + phone_number_id + "/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
}

async function markMessageAsRead(request: Request) {
  const token = process.env.WHATSAPP_TOKEN;
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
      // console.log(error);
    });
}
