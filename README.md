# RuangKode — Forum Diskusi Developer

Proyek orisinal React + Redux Toolkit untuk tugas **Membangun Aplikasi React dengan Redux** pada kelas Dicoding *Menjadi React Web Developer Expert*.

## Menjalankan

Persyaratan: Node.js 20+ dan npm.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Untuk mengubah URL API, salin `.env.example` menjadi `.env` kemudian sesuaikan `VITE_API_BASE_URL`.

```bash
npm run lint       # ESLint (Dicoding Academy JavaScript Style Guide)
npm test           # unit, integration & component test (Vitest + React Testing Library)
npm run e2e        # end-to-end test alur login (Cypress, otomatis menyalakan dev server)
npm run storybook  # katalog komponen (Storybook) di http://localhost:6006
npm run build
```

## Automation testing & CI/CD (submission akhir)

| Kriteria | Lokasi implementasi |
| --- | --- |
| Pengujian reducer (>3) | `src/features/auth/authSlice.test.js`, `src/features/ui/uiSlice.test.js`, `src/features/threads/threadsSlice.test.js` |
| Pengujian thunk (>3) | `src/features/auth/authSlice.test.js` (`loginUser`, `registerUser`), `src/features/votes/voteThunks.test.js` |
| Pengujian React component (>3) | `src/pages/AuthPage.test.jsx`, `src/components/thread/VoteActions.test.jsx`, `src/components/ui/Toast.test.jsx`, `src/components/ui/StatusViews.test.jsx` |
| Pengujian End-to-End alur login | `cypress/e2e/login.cy.js` |
| Skenario pengujian | Blok komentar di bagian atas setiap berkas pengujian |
| Continuous Integration (GitHub Actions) | `.github/workflows/ci.yml` — lint, `npm test`, `npm run e2e` pada setiap pull request ke `master` |
| Continuous Deployment (Vercel) | Repository terhubung ke Vercel; `vercel.json` menangani rewrite route SPA |
| React Ecosystem: **Storybook** (10 stories) | `.storybook/`, `src/**/*.stories.jsx` |
| Screenshot CI/CD & branch protection | `screenshot/` |

## Fitur dan kriteria

| Kriteria | Lokasi implementasi |
| --- | --- |
| Registrasi, login, logout, restore session | `src/features/auth`, `src/pages/AuthPage.jsx` |
| List thread, author, tanggal, komentar | `src/pages/HomePage.jsx`, `src/components/thread/ThreadCard.jsx` |
| Detail thread dan seluruh komentar | `src/pages/ThreadDetailPage.jsx` |
| Menulis thread dan komentar (perlu login) | `src/pages/NewThreadPage.jsx`, `src/pages/ThreadDetailPage.jsx` |
| Loading indicator, error, empty state | `src/components/ui/StatusViews.jsx`, `src/components/ui/LoadingBar.jsx` |
| Redux store dan thunk API di luar komponen | `src/app/store.js`, `src/features`, `src/api/forumApi.js` |
| ESLint (Dicoding Academy JavaScript Style Guide via `eslint-config-dicodingacademy`) + React StrictMode | `eslint.config.js`, `src/main.jsx` |
| **Saran 1**: Upvote/downvote/neutral thread dan komentar; status vote; optimistic update + rollback | `src/features/votes/voteThunks.js`, `src/components/thread/VoteActions.jsx` |
| **Saran 2**: Leaderboard nama, avatar, skor | `src/pages/LeaderboardPage.jsx` |
| **Saran 3**: Filter kategori client-side | `src/features/ui/uiSlice.js`, `src/utils/selectors.js`, `src/pages/HomePage.jsx` |
| Bonus: pencarian, pengurutan, notifikasi, responsive UI | `src/utils/selectors.js`, `src/styles/main.css` |

## Susunan arsitektur

- `src/api` — **satu-satunya** lokasi HTTP request.
- `src/features` — Redux slices + asynchronous thunks (UI tidak melakukan fetch).
- `src/app` — konfigurasi Redux Store.
- `src/components` — komponen presentasi yang modular dan reusable.
- `src/pages` — komposisi halaman dan dispatch action.
- `src/utils` — utilitas murni termasuk selector filter/sort.
- `src/styles` — UI custom CSS, tanpa framework/UI component library.

Semua pengoperasian vote dilakukan dengan optimistic dispatch, diikuti request API. Jika request gagal, state lama dikembalikan dan error ditampilkan. Saat tombol vote aktif ditekan ulang, endpoint `neutral-vote` digunakan.

## Cara tes manual

1. Tanpa login: buka daftar thread, cari, ubah filter kategori, urutan, baca detail dan komentar.
2. Register: isi nama, email, kata sandi. Sukses auto-login; logout; login ulang.
3. Masuk lalu buat thread baru (judul, kategori, body); cek muncul di daftar dan detail.
4. Masuk lalu kirim komentar; cek total komentar dan author.
5. Upvote/downvote thread **dan komentar**, cek perubahan angka/warna segera; tekan ulang untuk netral.
6. Putuskan koneksi sementara pada browser (DevTools > Network > Offline), coba vote dan pastikan rollback + pesan gagal.
7. Buka leaderboard, cek nama, avatar dan score.
8. Coba resize tampilan desktop dan ponsel; jalankan `npm run lint`, `npm test`, `npm run e2e`, `npm run build`.

**Catatan penting:** URL Dicoding Forum API harus dapat diakses dari browser saat menjalankan aplikasi. Tidak ada mock data yang digunakan sebagai pengganti respons API untuk kebutuhan submission. Hindari menyertakan `node_modules` dan `dist` saat ZIP dikirimkan.

## Etika submission

Proyek disusun sebagai implementasi baru dan bukan salinan aplikasi contoh. Pahami kodenya, lakukan uji fungsional terhadap API, dan modifikasi sesuai hasil pembelajaran sendiri sebelum submission. Nilai akhir tetap merupakan keputusan reviewer Dicoding.
