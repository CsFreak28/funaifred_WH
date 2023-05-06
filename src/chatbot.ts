import { payload } from "./interfaces.js";
class ChatBot {
  name: string;
  chatBotFunctions: {
    [name: string]: string;
  };
  constructor(chatbotType: string) {
    this.name = chatbotType;
    this.chatBotFunctions = {};
  }
  processMessage = (message: string) => {
    let resolve: undefined | string = this.chatBotFunctions[message];
  };
  reply = () => {};
}
