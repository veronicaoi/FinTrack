import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Paste your web app config from the Firebase console
// (Project Settings -> General -> Your apps -> SDK setup and configuration).
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5E98GjGiPa8kYk2mbD11LI6EqeT_Y3hk",
  authDomain: "fintrack-571b7.firebaseapp.com",
  projectId: "fintrack-571b7",
  storageBucket: "fintrack-571b7.firebasestorage.app",
  messagingSenderId: "206175688972",
  appId: "1:206175688972:web:5203bb4448b33a22d09129",
  measurementId: "G-L9H5YXW6TZ"
};

const firebaseApp = initializeApp(firebaseConfig);

// Firebase JS SDK doesn't persist auth sessions on React Native by
// default (it's built for web); this wires it up to AsyncStorage so
// users stay logged in between app launches.
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default firebaseApp;
