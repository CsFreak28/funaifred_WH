var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { storage } from "./firebaseConfig.js";
import { ref, updateMetadata, uploadString } from "firebase/storage";
export function uploadImageToFirebase(base64Str, usersDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageRef = ref(storage, `${usersDetails.userName}_${usersDetails.level}_${usersDetails.semester} Result.pdf`);
        yield uploadString(storageRef, base64Str, "base64").then((snapshot) => {
            console.log(snapshot, "success uploading");
        });
        const newMetaData = {
            contentType: "application/pdf",
        };
        updateMetadata(storageRef, newMetaData).then(() => {
            console.log("updated meta data");
        });
    });
}
