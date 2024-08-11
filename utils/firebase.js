import { initializeApp } from 'firebase/app';
import {collection, getFirestore} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from "../config/firebaseConf";
import * as ImageManipulator from "expo-image-manipulator";

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);
//if we close the app we don't lose the user auth from firebase
export const FIREBASE_AUTH = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const DEFAULT_PROFILE_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/train-master-39445.appspot.com/o/images%2Favatars%2Fuser.png?alt=media&token=140027b0-d067-47e5-b488-8e10dcce609f";

export const roomRef = collection(FIRESTORE_DB, "rooms");
export const userRef = collection(FIRESTORE_DB, "users");

const resizeImage = async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage.uri;
};

export const uploadProfileImage = async (uri, userId) => {
    //resize the image size
    const resizedUri = await resizeImage(uri);

    // convert image to array of bytes
    const image = await fetch(resizedUri);
    const blob = await image.blob();

    const imageRef = ref(FIREBASE_STORAGE, `images/avatars/${userId}`);
    await uploadBytes(imageRef, blob);

    return getDownloadURL(imageRef);
}


//for uploading data in database
/*const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const { getAuth, initializeAuth } = require('firebase/auth');

const app = initializeApp(firebaseConfig);
const FIRESTORE_DB = getFirestore(app);
const FIREBASE_STORAGE = getStorage(app);
const FIREBASE_AUTH = getAuth(app);

module.exports = { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH };*/