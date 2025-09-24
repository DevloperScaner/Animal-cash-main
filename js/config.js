// js/config.js — GANTI dengan config Firebase kamu
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// OPTIONAL: Set to true jika kamu pakai custom claims admin via Cloud Functions
export const useCustomAdminClaim = false;
