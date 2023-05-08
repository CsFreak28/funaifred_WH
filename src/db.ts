import db from "./firebaseConfig.js";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  arrayUnion,
  query,
  getDocs,
  where,
  DocumentData,
} from "firebase/firestore";
import { conversation } from "./interfaces.js";
export async function userExistsInDB(
  phoneNumber: string
): Promise<DocumentData | undefined> {
  //get the users record from firebase
  const docRef = doc(db, "conversations", `${phoneNumber}`);
  const docSnap = await getDoc(docRef);
  let usersDBRecord: DocumentData | undefined = undefined;
  if (docSnap.exists()) {
    usersDBRecord = docSnap.data().conversation;
  }
  return usersDBRecord;
}
export async function addConversationToUserDB(
  phoneNumber: string,
  conversation: conversation
) {}
