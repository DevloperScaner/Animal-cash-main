
# Animals Cash — Firebase Version

## Langkah cepat
1. Buka `js/config.js` dan **isi firebaseConfig** punyamu.
2. Deploy **rules** ke Firestore pakai CLI:
   ```sh
   firebase deploy --only firestore:rules
   ```
3. Upload project ke hosting statis (Vercel/Netlify).

## Login & Register
- **Email/Password**: form biasa.
- **Phone-as-email**: email semu `NOHP@phone.local` + password yang kamu isi.

Saat user baru dibuat, otomatis dibuat dokumen `/users/{uid}` dengan `role: "user"`.

## Admin Panel
- URL: `/admin/index.html`.
- **Akses** diberikan jika user punya **custom claim** `admin=true` *atau* field `role: "admin"` di dokumen `/users/{uid}` (rules).
- Panel memungkinkan ubah `role` user (admin/user).

> Catatan: untuk set **custom claim**, jalankan via Cloud Functions/Admin SDK.
