import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCRNLOjYtp8mmWjqI7GzIgPWJWt7tb8g9Q",
    authDomain: "train-master-39445.firebaseapp.com",
    projectId: "train-master-39445",
    storageBucket: "train-master-39445.appspot.com",
    messagingSenderId: "755050876649",
    appId: "1:755050876649:web:e3b97e5bbfd8a95e28ea78"
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);
export const FIREBASE_AUTH = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

//for uploading data in database
/*const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const { getAuth, initializeAuth } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyCRNLOjYtp8mmWjqI7GzIgPWJWt7tb8g9Q",
    authDomain: "train-master-39445.firebaseapp.com",
    projectId: "train-master-39445",
    storageBucket: "train-master-39445.appspot.com",
    messagingSenderId: "755050876649",
    appId: "1:755050876649:web:e3b97e5bbfd8a95e28ea78"
};

const app = initializeApp(firebaseConfig);
const FIRESTORE_DB = getFirestore(app);
const FIREBASE_STORAGE = getStorage(app);
const FIREBASE_AUTH = getAuth(app);

module.exports = { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH };*/