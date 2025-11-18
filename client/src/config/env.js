const API_URL = import.meta.env.VITE_BACKEND_URL;
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

export const config = {
  apiUrl: API_URL,
  firebaseApiKey: FIREBASE_API_KEY,
  firebaseAuthDomain: FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: FIREBASE_PROJECT_ID,
  firebaseStorageBucket: FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: FIREBASE_APP_ID,
  firebaseMeasurementId: FIREBASE_MEASUREMENT_ID,
}
