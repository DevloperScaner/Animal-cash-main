
# Animals Cash — Complete Build
Semua fitur dari pembahasan kita dimasukkan:
- Frontend: Dashboard, Farm (QR + upload Cloudinary), Withdraw (min 50rb, 1x/hari, fee 3.000), Referral (bonus 5.000 masuk saldo), Contact Support, Aktivitas, i18n-ready, dark/light mode, banner slider (3 detik), loading screen 10 detik typewriter.
- Admin Panel: Dashboard KPI ringkas, Orders (approve -> buat holdings), Withdrawals (approve/reject), Referrals (bayar bonus -> tambah saldo + riwayat), Banners CRUD, Settings (withdraw, loading, theme).
- Firestore security rules + indexes + firebase config.

## Quick Start
1) `firebase login`
2) `firebase use investasi-hewan` (atau ganti di .firebaserc)
3) Deploy rules & indexes:
   - `firebase deploy --only firestore:rules`
   - `firebase deploy --only firestore:indexes`
4) Hosting (opsional):
   - `firebase deploy --only hosting`

Cloudinary:
- `cloudName`: dn1eh1jfi
- `uploadPreset`: Animal-cash-main

Note:
- Buat akun admin manual (set custom claim `admin:true`) via Functions/Console agar Admin Panel bisa write.
- App Check/FCM tidak di-enforce di build ini; bisa diaktifkan kemudian dari Admin Settings.
