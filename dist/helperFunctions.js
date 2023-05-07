import { Configuration, OpenAIApi } from "openai";
//setup openai configuration
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));
export function textIsAGreeting(text) {
    let textIsAGreeting = "No";
    openai
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
            textIsAGreeting = (_a = res.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            console.log(textIsAGreeting);
            // msgToSend = res.data.choices[0].message.content;
        }
    })
        .catch((e) => {
        console.log("there was an error when processing request");
    });
    return false;
}
export function getConversation(phoneNumber, mapOfConversations) { }
export function userExists(phoneNumber) { }
