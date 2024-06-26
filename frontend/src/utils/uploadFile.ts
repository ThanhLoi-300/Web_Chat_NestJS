import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import config from "../config";

const firebaseConfig = {
  apiKey: import.meta.env.APIKEY,
  authDomain: import.meta.env.authDomain,
  projectId: import.meta.env.projectId,
  storageBucket: import.meta.env.storageBucket,
  messagingSenderId: "1039293544656",
  appId: import.meta.env.appId,
  measurementId: import.meta.env.measurementId,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();

export default app;

export const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            resolve(url);
          })
          .catch((error) => {
            console.log("Error getting download URL:", error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
        reject(error);
      });
  });
};

export const uploadFiles = (files: File[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const uploadPromises: Promise<string>[] = [];

    for (const file of files) {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

      const uploadPromise = uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .catch((error) => {
          console.log("Error uploading file:", error);
          throw error;
        });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((urls) => {
        resolve(urls);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const storage = getStorage(app);
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log("Ảnh đã được xóa thành công: " + imagePath);
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
  }
};