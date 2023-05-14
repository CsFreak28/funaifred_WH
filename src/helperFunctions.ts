import { AxiosResponse } from "axios";
import { Configuration, OpenAIApi } from "openai";
import { conversation, conversations } from "./interfaces.js";
//setup openai configuration

export function userExistsInLocalConversations(
  phoneNumber: string,
  conversations: conversations
): conversation | undefined {
  let usersConversation = conversations[phoneNumber];
  return usersConversation;
}

export function extractDepartmentAndLevel(text: string) {
  console.log("the text", text);
  let abbreviations: any = [
    {
      CSC: {
        deptFullName: "Computer Science",
        levels: ["100", "200", "300", "400"],
      },
    },
  ];
  let dept: string = "";
  let level = "";
  let deptFullName = "";
  let deptExists: boolean = false;
  const splitText = text.split("");
  let arrayOfNumbers = ["1", "2", "3", "4", "5", "6", "0"];
  let arrayOfLetters = "ABCDEFGHJHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 0; i < splitText.length; i++) {
    let letter = splitText[i];
    if (arrayOfNumbers.includes(letter) && level.length < 3) {
      level += letter;
    } else if (arrayOfLetters.includes(letter)) {
      dept += letter;
    }
  }
  let obj = abbreviations[0];
  for (let i in obj) {
    if (dept === i) {
      let deptInfo = obj[i];
      deptFullName = deptInfo.deptFullName;
      deptExists = deptInfo.levels.includes(level);
    }
  }
  console.log("debug 20$$", deptFullName, deptExists);
  return {
    deptFullName,
    deptExists,
    level,
    dept,
  };
}
