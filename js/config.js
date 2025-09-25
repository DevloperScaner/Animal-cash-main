export const firebaseConfig = {
  apiKey: "AIzaSyB7Xlu02Winh4wp2XDzw5592yE9_J-qiuM",
  authDomain: "investasi-hewan.firebaseapp.com",
  projectId: "investasi-hewan",
  storageBucket: "investasi-hewan.appspot.com",
  messagingSenderId: "180728484800",
  appId: "1:180728484800:web:f2fcd8e390b636dfb6ee25"
};

export const cloudinary = { cloudName: "dn1eh1jfi", uploadPreset: "Animal-cash-main" };

export const adminAllowlist = {
  emails: ["airdropshunterid@gmail.com"],
  uids: []
};

export const defaults = {
  loading: { durationMs: 10000, mode: "fixed", title: "ANIMALS CASH", theme: "rainbow" },
  theme: { default: "system", accent: "#59d1ff", animatedBrand: true, seasonalActive: false, seasonalName: "" },
  layout: { dashboardGrid: "2x4" },
  withdraw: { min: 50000, fee: 3000, maxPerDay: 1 },
  referral: { bonus: 5000 }
};
