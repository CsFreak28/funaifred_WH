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
  type?: "interactive" | "list";
  options?: {
    [key: string]: {
      message: string;
      id: string;
    };
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
  usrSentence: string;
  usrSentenceID: string;
  usrPhoneNumber: string;
  sentenceUsrIsReplyingID?: string;
  userHasLocalConversation?: boolean;
}
export interface conversation {
  timeOfInteraction: string;
  lastBotSentence: sentenceInterface;
  lastChat: string;
  previousSentences: Array<sentenceInterface> | null;
}
export interface conversations {
  [key: string]: conversation;
}
