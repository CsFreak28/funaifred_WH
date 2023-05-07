var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Configuration, OpenAIApi } from "openai";
//setup openai configuration
export function textIsAGreeting(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let usrsText = "No";
        let apiKey = process.env.OPENAI_API_KEY;
        console.log(apiKey);
        let textIsAGreeting = false;
        const openai = new OpenAIApi(new Configuration({
            apiKey: apiKey,
        }));
        yield openai
            .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `is ${text} a greeting, answer only yes or no`,
                },
            ],
        })
            .then((res) => {
            var _a;
            if (res !== undefined) {
                usrsText = (_a = res.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
                if (usrsText == "Yes.") {
                    textIsAGreeting = true;
                    console.log(usrsText);
                }
                // msgToSend = res.data.choices[0].message.content;
            }
        })
            .catch((e) => {
            console.log("there was an error here", e.status);
        });
        console.log(textIsAGreeting);
        return textIsAGreeting;
    });
}
export function getConversation(phoneNumber, mapOfConversations) { }
export function userExists(phoneNumber) { }
