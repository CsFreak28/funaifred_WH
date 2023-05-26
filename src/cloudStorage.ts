import { storage } from "./firebaseConfig.js";
import { ref, updateMetadata, uploadString } from "firebase/storage";
export async function uploadImageToFirebase(
  base64Str: string,
  usersDetails: {
    userName: string;
    usersDept: string;
    semester: string;
    level: string;
  }
) {
  const storageRef = ref(
    storage,
    `${usersDetails.userName}_${usersDetails.level}_${usersDetails.semester} Result.pdf`
  );
  await uploadString(storageRef, base64Str, "base64").then((snapshot) => {
    console.log(snapshot, "success uploading");
  });
  const newMetaData = {
    contentType: "application/pdf",
  };
  updateMetadata(storageRef, newMetaData).then(() => {
    console.log("updated meta data");
  });
}
