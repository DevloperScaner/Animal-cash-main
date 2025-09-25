Animals Cash — Full Normal Patch (v2)
====================================

Yang disertakan (semua BERISI, bukan kosong):
- dashboard.html
- profile.html
- summary.html
- admin/index.html
- css/home.css
- admin/admin.css
- js/features/dashboard-fix.js
- js/features/home-ui.js
- js/features/profile.js
- js/features/farm-summary.js
- js/admin/orders.js
- js/admin/withdrawals.js
- js/admin/referrals.js
- js/app-core.js (utility toast)
- js/i18n.js (mini, membaca localStorage('lang'))

Catatan:
- **firebase-init.js** dan **config.js** tetap memakai milik kamu (tidak saya timpa).
- Jika kamu sudah punya `js/app-core.js` dan `js/i18n.js`, boleh pilih memakai punyamu.
- Semua halaman mengarahkan user login: bila belum login → redirect ke index.html.

Cara pasang cepat:
1) Ekstrak ZIP ini, timpa file ke project.
2) Pastikan `js/firebase-init.js` & `js/config.js` kamu sudah benar.
3) Deploy / refresh.
