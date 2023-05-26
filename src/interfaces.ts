import { DocumentData } from "firebase/firestore";

interface StudentProfile {
  firstName: string;
  lastName: string;
  paidForFred: boolean;
  interactedBefore: boolean;
  studentInfo: {
    level: number;
    department: string;
  };
  contactInfo: {
    email: string;
    phoneNumber: number;
  };
}

export interface reply {
  contextId?: string;
  typeOfReply?: "interactive" | "list" | "document";
  options?: {
    [key: string]:
      | {
          message: string;
          id: string;
        }
      | listReply;
  };
  message:
    | string
    | Array<
        | string
        | {
            message: string;
            typeOfReply: "interactive" | "list";
            options?: {
              [key: string]: {
                typeOfReply: "interactive";
                message: string;
                id: string;
              };
            };
          }
      >;
}
export interface message {
  text: string;
  prompt: string;
}
export interface option {
  [key: string]: string;
  sentence: string;
}
export interface sentenceInterface {
  msgId: string;
  options: {
    [key: string]: string;
  } | null;
  freeReply?: {
    replyTo: string;
  };
}
export interface usersMsgData {
  usersDBRecord: conversation | DocumentData | undefined;
  usrSentence: string;
  usrSentenceID: string;
  usersWhatsappName: string;
  usrPhoneNumber: string;
  sentenceUsrIsReplyingID?: string;
  userHasLocalConversation?: boolean;
}
export interface conversation {
  timeOfInteraction: string;
  chainAnswers?: Array<string>;
  interactedBefore?: boolean;
  lastBotSentence: sentenceInterface;
  registered?: {
    done: boolean;
    process: "none" | "courseRepConfirm";
  };
  lastChat: string;
  studentInfo?: {
    courseRep: string;
    dept: string;
    level: string;
    newName?: string;
  };
  previousSentences: Array<sentenceInterface>;
}
export interface conversations {
  [key: string]: conversation;
}
interface listItemOption {
  id: string;
  title: string;
  description?: string;
}
export interface reaction {
  typeOfReply: "reaction";
}
interface listItem {
  title: string;
  rows: Array<listItemOption>;
}
export interface listReply {
  message?: string;
  id: string;
  typeOfReply: "list";
  headers: {
    header: string;
    body: string;
    button: string;
    listItems: Array<listItem>;
  };
}
