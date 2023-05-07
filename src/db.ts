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
export async function userExistsInDB(
  phoneNumber: string
): Promise<DocumentData | undefined> {
  //get the users record from firebase
  const docRef = doc(db, "conversations", `${phoneNumber}`);
  const docSnap = await getDoc(docRef);
  let usersDBRecoord: DocumentData | undefined;
  if (docSnap.exists()) {
    usersDBRecoord = docSnap.data().conversation;
  }
  return userExistsInDB;
}
