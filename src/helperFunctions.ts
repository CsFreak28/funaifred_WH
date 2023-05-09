import { AxiosResponse } from "axios";
import { Configuration, OpenAIApi } from "openai";
import { conversation, conversations } from "./interfaces.js";
//setup openai configuration

export function getConversation(phoneNumber: string, mapOfConversations: []) {}
export function userExistsInLocalConversations(
  phoneNumber: string,
  conversations: conversations
): conversation | undefined {
  let usersConversation = conversations[phoneNumber];
  return usersConversation;
}
