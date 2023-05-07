import { AxiosResponse } from "axios";
import { Configuration, OpenAIApi } from "openai";
import { conversation, conversations } from "./interfaces.js";
//setup openai configuration

export async function textIsAGreeting(text: string): Promise<boolean> {
  let usrsText: string | undefined = "No";
  let apiKey = process.env.OPENAI_API_KEY;
  console.log(apiKey);
  let textIsAGreeting: boolean = false;
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  );
  await openai
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
      if (res !== undefined) {
        usrsText = res.data.choices[0].message?.content;
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
}
export function getConversation(phoneNumber: string, mapOfConversations: []) {}
export function userExistsInLocalConversations(
  phoneNumber: string,
  conversations: conversations
): conversation | undefined {
  let usersConversation = conversations[phoneNumber];
  return usersConversation;
}
