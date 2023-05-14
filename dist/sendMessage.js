var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { setConversationID } from "./store.js";
export default function replySentenceWithText(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.WHATSAPP_TOKEN;
        markMessageAsRead(request);
        // console.log("this is the token", token);
        let phone_number_id = request.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = request.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let response;
        if (typeof reply.message !== "object") {
            response = yield axios({
                method: "POST",
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
        }
        else if (typeof reply.message === "object") {
            let firstMessage = reply.message[0];
            let secondMessage = reply.message[1];
            yield axios({
                method: "POST",
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
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                console.log("#debug 0: process entered the .then block");
                let msgID = response.data.messages[0].id;
                setConversationID(from, msgID);
                if (secondMessage !== undefined) {
                    console.log("#debug 1 :second message not undefined");
                    let contextID = response.data.messages[0].id;
                    if (typeof secondMessage === "object") {
                        if (secondMessage.options !== undefined &&
                            secondMessage.options[Object.keys(secondMessage.options)[0]]
                                .typeOfReply === "interactive") {
                            console.log("#debug 2 :second message is an interactive Message");
                            let response = yield replySentenceWithInteractive(request, secondMessage);
                            let msgID = response.data.messages[0].id;
                            setConversationID(from, msgID);
                        }
                    }
                    else {
                        let response = yield axios({
                            method: "POST",
                            url: "https://graph.facebook.com/v15.0/" +
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
            }))
                .catch(() => { });
        }
        return response;
    });
}
export function replySentenceWithInteractive(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.WHATSAPP_TOKEN;
        markMessageAsRead(request);
        let phone_number_id = request.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = request.body.entry[0].changes[0].value.messages[0].from;
        let response = "";
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
        yield axios({
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
            // console.log("this is the error oo", e);
        });
        return response;
    });
}
export function replySentenceWithList(request, listReply) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.WHATSAPP_TOKEN;
        console.log("debug #5 : process entered list");
        let phone_number_id = request.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = request.body.entry[0].changes[0].value.messages[0].from;
        let response = "";
        response = yield axios({
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
            console.log("this is the sendList Error");
        });
        return response;
    });
}
function markMessageAsRead(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = process.env.WHATSAPP_TOKEN;
        let msgID = request.body.entry[0].changes[0].value.messages[0].id;
        console.log(msgID);
        let phone_number_id = request.body.entry[0].changes[0].value.metadata.phone_number_id;
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
        yield axios(config)
            .then(function (response) {
            console.log("mark message as read, complete");
        })
            .catch(function (error) {
            // console.log(error);
        });
    });
}
