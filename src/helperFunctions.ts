import { AxiosResponse } from "axios";
import { Configuration, OpenAIApi } from "openai";
//setup openai configuration

export function textIsAGreeting(text: string): boolean {
  let textIsAGreeting: string | undefined = "No";
  console.log(process.env.OPENAI_API_KEY);
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );
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
      if (res !== undefined) {
        textIsAGreeting = res.data.choices[0].message?.content;
        console.log(textIsAGreeting);
        // msgToSend = res.data.choices[0].message.content;
      }
    })
    .catch((e) => {
      console.log("there was an error when processing request", e);
    });
  return false;
}
export function getConversation(phoneNumber: string, mapOfConversations: []) {}
export function userExists(phoneNumber: string) {}
