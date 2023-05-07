import { Configuration, OpenAIApi } from "openai";
//setup openai configuration
export function textIsAGreeting(text) {
    let usrsText = "No";
    console.log(process.env.OPENAI_API_KEY);
    let textIsAGreeting = false;
    const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    }));
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
            usrsText = (_a = res.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            if (usrsText == "Yes.") {
                textIsAGreeting = true;
                console.log(usrsText);
            }
            // msgToSend = res.data.choices[0].message.content;
        }
    })
        .catch((e) => {
        console.log("there was an error when processing request", e.status);
    });
    return textIsAGreeting;
}
export function getConversation(phoneNumber, mapOfConversations) { }
export function userExists(phoneNumber) { }
