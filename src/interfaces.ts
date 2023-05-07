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
  contextId: string | undefined;
  message: string | Array<string>;
  noReply: boolean;
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
  usrSentenceID: string | undefined;
}
export interface conversation {
  timeOfInteraction: string;
  lastBotSentence: sentenceInterface;
  lastChat: string;
  previousSentences: Array<sentenceInterface> | null;
}
