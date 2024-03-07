import { initializeApp } from "firebase/app";
import config from "./config";
import { getAuth } from "firebase/auth";

const firebaseApp = initializeApp(config.firebase);

export const auth = getAuth(firebaseApp);

export default firebaseApp;
