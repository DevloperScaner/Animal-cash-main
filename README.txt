PETERNAKAN HEWAN — V0.2 (Integrasi Dasar)
=========================================

✔ Home/Dashboard:
- Topbar ikon-only (notif, bahasa, tema)
- Banner slider otomatis (3 slide)
- 3 kartu statistik
- Grid 3×3, 2 halaman, swipe halus (ukuran item terkunci)
- Tabbar bawah center
- Dialog bahasa & notifikasi

✔ Auth (Firebase):
- login.html + register.html terhubung Auth
- Register membuat users/{uid} (displayName, email, role:user, createdAt)
- Home hanya bisa diakses jika login (guard)
- Setelah login/daftar → spinner 5 detik → redirect ke index.html

✔ Halaman terpisah:
- pages/* (tanpa topbar/banner/tabbar), ada tombol “← Kembali”

Cara pakai cepat:
1) Upload seluruh isi folder ke hosting.
2) Pastikan Auth & Firestore aktif di project Firebase kamu.
3) rules Firestore minimal: allow read/write if request.auth != null (untuk uji awal).
4) Buka /register.html → buat akun → otomatis redirect ke Dashboard.

Next (V0.3):
- i18n string (bahasa beneran di seluruh UI)
- Notifikasi list
- Farm (ambil dari Firestore/animals)
- Withdraw flow (form awal)