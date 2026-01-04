# PustakaTerpadu

<img src="public/logo.svg" alt="PustakaTerpadu Logo" width="200">

**UAS Teknologi Sistem Terintegrasi - 18223096**

PustakaTerpadu adalah aplikasi Front-End terpadu untuk perpustakaan yang mengintegrasikan layanan katalog buku dan layanan sirkulasi/peminjaman. Aplikasi ini memungkinkan pengguna untuk melakukan alur lengkap dalam satu aplikasi, mulai dari melihat dan memfilter daftar buku, meminjam buku, melihat daftar pinjaman aktif beserta due date, mengecek denda, melakukan pengembalian (khusus librarian), hingga melihat riwayat peminjaman.

## Links

- **Website**: [https://uas-tst-18223096-pustaka-terpadu.vercel.app/](https://uas-tst-18223096-pustaka-terpadu.vercel.app/)
- **Repository**: [https://github.com/Matthew12-t/UAS-TST_18223096_PustakaTerpadu.git](https://github.com/Matthew12-t/UAS-TST_18223096_PustakaTerpadu.git)
- **Books Service**: `http://18223014.tesatepadang.space`
- **Loan Service**: `http://18223096.tesatepadang.space`

## Fitur Utama

### Untuk Semua Pengguna
- **Katalog Buku**: Melihat daftar lengkap buku perpustakaan
- **Pencarian & Filter**: Filter berdasarkan genre, tahun, dan penulis
- **Detail Buku**: Melihat informasi lengkap setiap buku

### Untuk Member (Pengguna Terdaftar)
- **Dashboard**: Ringkasan pinjaman aktif, keterlambatan, dan denda
- **Peminjaman Buku**: Meminjam buku langsung dari halaman detail
- **Pinjaman & Denda**: Melihat pinjaman aktif dengan tanggal jatuh tempo dan info denda
- **Riwayat Pinjaman**: Melihat histori peminjaman yang sudah dikembalikan

### Untuk Librarian
- **Pengembalian Buku**: Memproses pengembalian buku dari semua pengguna
- **Akses semua fitur Member**

## Tech Stack

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **React** | 19.2.0 | Library UI |
| **Vite** | 7.2.4 | Build tool & dev server |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **React Router** | 7.11.0 | Client-side routing |
| **Lucide React** | 0.562.0 | Ikon |
| **Jose** | 6.1.3 | JWT handling |
| **clsx & tailwind-merge** | - | Utility untuk className |

## Integrasi API

Aplikasi ini mengintegrasikan **2 backend service** yang berbeda:

### Cataloging Service (18223014)
Base URL: `http://18223014.tesatepadang.space`

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/books` | GET | Mengambil semua buku |
| `/api/books/:id` | GET | Mengambil detail buku berdasarkan ID |
| `/api/books/genres/:genre` | GET | Filter buku berdasarkan genre |
| `/api/books/year/:year` | GET | Filter buku berdasarkan tahun |
| `/api/books/author/:author` | GET | Filter buku berdasarkan penulis |

### Circulation Service (18223096)
Base URL: `http://18223096.tesatepadang.space`

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/auth/login` | POST | Login dan mendapatkan JWT token |
| `/loan/create` | POST | Membuat peminjaman baru |
| `/loan/fines/:userId` | GET | Mengambil data pinjaman & denda pengguna |
| `/loan/return` | POST | Memproses pengembalian buku |

## Struktur Proyek

```
UAS-TST_18223096_PustakaTerpadu/
├── public/
│   └── logo.svg            # Logo aplikasi
├── src/
│   ├── assets/             # Asset statis
│   ├── components/
│   │   ├── ui/             # Komponen UI (shadcn/ui style)
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   ├── spinner.jsx
│   │   │   └── table.jsx
│   │   ├── Layout.jsx          # Layout utama dengan navbar & footer
│   │   └── ProtectedRoute.jsx  # Route guard untuk autentikasi
│   ├── context/
│   │   └── AuthContext.jsx     # Context untuk autentikasi & JWT
│   ├── lib/
│   │   └── utils.js            # Utility functions (cn)
│   ├── pages/
│   │   ├── BookDetailPage.jsx  # Halaman detail buku
│   │   ├── BooksPage.jsx       # Halaman katalog buku
│   │   ├── DashboardPage.jsx   # Dashboard pengguna
│   │   ├── FinesPage.jsx       # Halaman pinjaman & denda
│   │   ├── LoginPage.jsx       # Halaman login
│   │   └── ReturnBookPage.jsx  # Halaman pengembalian (librarian)
│   ├── services/
│   │   ├── booksApi.js         # API service untuk Books Service
│   │   └── loanApi.js          # API service untuk Loan Service
│   ├── App.jsx                 # Root component dengan routing
│   ├── index.css               # Global styles dengan Tailwind
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js              # Konfigurasi Vite & proxy
├── jsconfig.json               # Path alias configuration
├── eslint.config.js            # ESLint configuration
└── package.json
```

## Instalasi & Menjalankan

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Langkah Instalasi

1. Clone repository
```bash
git clone https://github.com/Matthew12-t/UAS-TST_18223096_PustakaTerpadu.git
cd UAS-TST_18223096_PustakaTerpadu
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

File hasil build akan tersedia di folder `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Penggunaan

### Login
Aplikasi menggunakan sistem login sederhana berdasarkan User ID:
- **Member**: User ID dengan format `M-XXXXX` (contoh: `M-00001`)
- **Librarian**: User ID dengan format `L-XXXXX` (contoh: `L-00001`)

1. Buka aplikasi dan klik "Masuk"
2. Masukkan User ID sesuai format
3. Pilih role (Member/Librarian)
4. Klik "Masuk"

### Meminjam Buku
1. Buka "Katalog Buku" dari navbar
2. Gunakan filter atau search untuk mencari buku
3. Klik pada buku untuk melihat detail
4. Klik "Pinjam Buku" (memerlukan login sebagai member)

### Melihat Pinjaman & Denda
1. Login ke akun Anda
2. Buka "Pinjaman & Denda" dari navbar
3. Lihat daftar pinjaman aktif, riwayat, dan total denda

### Pengembalian Buku (Librarian Only)
1. Login dengan akun Librarian (L-XXXXX)
2. Buka "Pengembalian" dari navbar
3. Masukkan User ID member yang ingin mengembalikan buku
4. Klik "Cari" untuk melihat pinjaman aktif
5. Klik "Kembalikan" pada buku yang akan dikembalikan

## Halaman Aplikasi

| Halaman | Route | Deskripsi | Akses |
|---------|-------|-----------|-------|
| Login | `/login` | Form login dengan User ID & role | Public |
| Dashboard | `/` | Ringkasan pinjaman & denda | Member/Librarian |
| Katalog Buku | `/books` | Daftar buku dengan filter | Public |
| Detail Buku | `/books/:id` | Info lengkap buku & tombol pinjam | Public |
| Pinjaman & Denda | `/fines` | Data pinjaman aktif & riwayat | Member/Librarian |
| Pengembalian | `/return` | Proses pengembalian buku | Librarian Only |

## Konfigurasi Proxy

Aplikasi menggunakan Vite proxy untuk menghubungkan ke backend services:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api/loan': {
      target: 'http://18223096.tesatepadang.space',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/loan/, ''),
    },
    '/api/books': {
      target: 'http://18223014.tesatepadang.space',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/books/, '/api/books'),
    },
  },
}
```

## Autentikasi

Aplikasi menggunakan **dual token system**:
1. **Loan Token**: JWT dari Loan Service untuk operasi peminjaman
2. **Books Token**: JWT yang di-generate client-side untuk akses Books Service

Token disimpan di `localStorage` dan di-manage melalui `AuthContext`.