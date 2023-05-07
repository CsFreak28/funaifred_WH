import { Configuration, OpenAIApi } from "openai";
//setup openai configuration
export function textIsAGreeting(text) {
    let usrsText = "No";
    let apiKey = process.env.OPENAI_API_KEY;
    console.log(apiKey);
    let textIsAGreeting = false;
    const openai = new OpenAIApi(new Configuration({
        apiKey: apiKey,
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
        console.log("there was an error here", e.status);
    });
    return textIsAGreeting;
}
export function getConversation(phoneNumber, mapOfConversations) { }
export function userExists(phoneNumber) { }
