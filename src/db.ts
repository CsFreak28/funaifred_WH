import db from "./firebaseConfig.js";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  arrayUnion,
  DocumentData,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { conversation, sentenceInterface } from "./interfaces.js";
let studentProfileCollection = "studentProfiles";
let portalLogins = "";
export async function userExistsInDB(
  phoneNumber: string,
  whatToReturn: "conversation" | "fullDoc"
): Promise<DocumentData | undefined> {
  //get the users record from firebase
  const docRef = doc(db, studentProfileCollection, `${phoneNumber}`);
  const docSnap = await getDoc(docRef);
  let usersDBRecord: DocumentData | undefined = undefined;
  if (docSnap.exists()) {
    if (whatToReturn === "conversation") {
      usersDBRecord = docSnap.data().conversation;
    } else {
      usersDBRecord = docSnap.data();
    }
  }
  return usersDBRecord;
}
export async function addConversationToUserDB(
  phoneNumber: string,
  conversation: conversation
) {
  const userConvoRef = doc(db, studentProfileCollection, phoneNumber);
  const collectionRef = collection(db, studentProfileCollection);
  console.log("i am the problem");
  if (await userExistsInDB(phoneNumber, "conversation")) {
    console.log("sammyghcdjjsgf");
    await updateDoc(userConvoRef, {
      conversation: conversation,
    });
    console.log("updated doc");
  } else {
    console.log("i am the problem");
    setDoc(doc(db, studentProfileCollection, phoneNumber), {
      conversation: conversation,
    });
  }
}
export async function addLastSentenceToUserDB(
  phoneNumber: string,
  conversation: sentenceInterface
) {
  const userConvoRef = doc(db, studentProfileCollection, phoneNumber);
  await updateDoc(userConvoRef, {
    "conversation.lastBotSentence": conversation,
    "conversation.previousSentences": arrayUnion(conversation),
  });
  console.log("addedlastSentence : updated doc");
}

export async function updateUserIsNowRegistered(phoneNumber: string) {
  const userConvRef = doc(db, studentProfileCollection, phoneNumber);
  await updateDoc(userConvRef, {
    "conversation.registered": {
      done: true,
      process: "none",
    },
  });
  console.log("updateUserdetail : update doc");
}

export async function updateUserDetail(
  phoneNumber: string,
  userDetail: {
    dept: string;
    courseRep: string;
  }
) {
  const userConvRef = doc(db, studentProfileCollection, phoneNumber);
  await updateDoc(userConvRef, {
    "conversation.userDetails": {
      dept: userDetail.dept,
      courseRep: userDetail.courseRep,
    },
  });
}

export async function updateIncompleteRegReasonInDB(phoneNumber: string) {
  const userConvRef = doc(db, studentProfileCollection, phoneNumber);
  await updateDoc(userConvRef, {
    "conversation.registered": {
      done: false,
      process: "courseRepConfirm",
    },
  });
  console.log("updateIncompleteRegReasonInDB : update doc");
}

export async function updateChainAnswer(
  phoneNumber: string,
  action: "push" | "clear",
  answer?: string
) {
  const userConvRef = doc(db, studentProfileCollection, phoneNumber);
  if (action === "clear") {
    await updateDoc(userConvRef, {
      "conversation.chainAnswers": [],
    });
  } else {
    if (answer !== undefined) {
      await updateDoc(userConvRef, {
        "conversation.chainAnswers": arrayUnion(answer),
      });
    }
  }
}

export async function clearSentences(phoneNumber: string = "2348088663596") {
  const userConvRef = doc(db, studentProfileCollection, phoneNumber);
  await updateDoc(userConvRef, {
    "conversation.previousSentences": [],
  });
  console.log("clearing done");
}
export async function checkIfLoginsAreAvailable(
  collection: string,
  phoneNumber: string
) {
  const docRef = doc(db, collection, `${phoneNumber}`);
  const docSnap = await getDoc(docRef);
  let usersDBRecord: DocumentData | undefined = undefined;
  if (docSnap.exists()) {
    usersDBRecord = docSnap.data();
  }
  return usersDBRecord;
}

function getDifferenceInHours(date1: Date, date2: Date) {
  // Convert the dates to milliseconds
  const milliseconds1 = date1.getTime();
  const milliseconds2 = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = milliseconds2 - milliseconds1;

  // Calculate the difference in hours
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );
  console.log(differenceInHours);
  // Return the difference in hours
  return differenceInHours;
}
