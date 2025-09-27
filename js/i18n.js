export const LANGS = {
  id: { app_name: "PETERNAKAN HEWAN", title_dashboard:"Dashboard — PETERNAKAN HEWAN",
        hero_title_1:"Bonus Referral Rp 5.000", hero_desc_1:"Undang temanmu, bonus otomatis masuk saldo.",
        hero_title_2:"Panen Harian", hero_desc_2:"Pendapatan masuk setiap hari sesuai siklus.",
        hero_title_3:"Keamanan Dana", hero_desc_3:"Verifikasi admin untuk setiap transaksi.",
        total_assets:"Total Asset", quant_acc:"Akun Kuantitatif", active_holding:"Holding Aktif",
        menu:"Menu", farm:"Farm", invite:"Mengundang", withdraw:"Menarik", summary:"Ringkasan",
        history:"Riwayat", settings:"Pengaturan", me:"Aku", home:"Home",
        contact:"Contact Support", notifications:"Notifikasi", news:"Berita",
        tasks:"Pusat Tugas", faq:"FAQ", promo:"Promo", leaderboard:"Leaderboard",
        admin:"Admin", logout:"Logout"
      },
  en: { app_name: "LIVESTOCK FARM", title_dashboard:"Dashboard — LIVESTOCK FARM",
        hero_title_1:"Referral Bonus Rp 5,000", hero_desc_1:"Invite friends; bonus goes to your balance.",
        hero_title_2:"Daily Harvest", hero_desc_2:"Earnings accrue daily per cycle.",
        hero_title_3:"Funds Security", hero_desc_3:"Admin verification for each transaction.",
        total_assets:"Total Assets", quant_acc:"Quantitative Accounts", active_holding:"Active Holdings",
        menu:"Menu", farm:"Farm", invite:"Invite", withdraw:"Withdraw", summary:"Summary",
        history:"History", settings:"Settings", me:"Me", home:"Home",
        contact:"Contact Support", notifications:"Notifications", news:"News",
        tasks:"Task Center", faq:"FAQ", promo:"Promo", leaderboard:"Leaderboard",
        admin:"Admin", logout:"Logout"
      },
  ms: { app_name:"TENAK HAIWAN", title_dashboard:"Papan Pemuka — TENAK HAIWAN",
        hero_title_1:"Bonus Rujukan Rp 5.000", hero_desc_1:"Jemput rakan; bonus masuk baki.",
        hero_title_2:"Tuaian Harian", hero_desc_2:"Pendapatan harian ikut kitaran.",
        hero_title_3:"Keselamatan Dana", hero_desc_3:"Sahkan oleh admin setiap transaksi.",
        total_assets:"Jumlah Aset", quant_acc:"Akaun Kuantitatif", active_holding:"Pegangan Aktif",
        menu:"Menu", farm:"Farm", invite:"Jemput", withdraw:"Tarik", summary:"Ringkasan",
        history:"Sejarah", settings:"Tetapan", me:"Saya", home:"Laman Utama",
        contact:"Sokongan", notifications:"Notifikasi", news:"Berita",
        tasks:"Pusat Tugasan", faq:"Soalan Lazim", promo:"Promosi", leaderboard:"Papan Kedudukan",
        admin:"Admin", logout:"Log Keluar"
      }
};
const KEY = "lang";
export function getLang(){ return localStorage.getItem(KEY) || "id"; }
export function setLang(v){ localStorage.setItem(KEY, v); apply(); }
export function t(k){ const L = LANGS[getLang()]||LANGS.id; return L[k] || k; }
export function apply(){
  const L = LANGS[getLang()]||LANGS.id;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (el.tagName === "TITLE") { el.textContent = L[key] || el.textContent; }
    else el.textContent = L[key] || el.textContent;
  });
}
document.addEventListener("DOMContentLoaded", apply);
