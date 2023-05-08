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
const token = process.env.WHATSAPP_TOKEN;
export default function replySentenceWithText(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
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
                console.log(token);
                console.log("error replying with text");
            });
            let msgID = response.data.messages[0].id;
            console.log("the msgID", msgID);
            setConversationID(from, msgID);
        }
        else if (typeof reply.message === "object") {
            reply.message.forEach((message, i) => __awaiter(this, void 0, void 0, function* () {
                if (typeof message !== "object") {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield axios({
                            method: "POST",
                            url: "https://graph.facebook.com/v15.0/" +
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
                    }), 500);
                }
                else if (message.typeOfReply === "interactive") {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        console.log("sent out");
                        const response = yield replySentenceWithInteractive(request, message);
                        let msgID = response.data.messages[0].id;
                        console.log("the msgID", msgID);
                        setConversationID(from, msgID);
                    }), 500);
                }
            }));
        }
        return response;
    });
}
export function replySentenceWithInteractive(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
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
            console.log("this is the error oo", e);
        });
        return response;
    });
}
