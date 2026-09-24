# ⚡ Satset — MVP Quick-Commerce Web App

Aplikasi web MVP ala **ASTRO** (on-demand grocery & essentials delivery) untuk Indonesia. Dibuat dengan Next.js + React + Tailwind CSS. Pembayaran menggunakan **Xendit Invoice** (nyata, mode test tersedia); data produk & pesanan masih di sisi klien (`localStorage`).

## ✨ Fitur

- 🛒 **Katalog produk** — 30 produk dalam 9 kategori (buah & sayur, susu & telur, snack, minuman, sembako, dll.)
- 🔍 **Pencarian & filter kategori** — cari produk berdasarkan nama/deskripsi, filter per kategori
- 🏷️ **Promo/diskon** — badge diskon dan harga coret
- 🛍️ **Keranjang belanja** — tambah/kurang/hapus item, tersimpan di `localStorage`, badge jumlah di header
- 🚚 **Gratis ongkir** — otomatis untuk belanja min. Rp50.000, dengan progress bar
- 💳 **Checkout** — form alamat pengiriman + 4 metode pembayaran (COD, e-wallet, transfer, kartu) — pembayaran disimulasikan
- 🧾 **Riwayat pesanan** — daftar semua pesanan yang pernah dibuat
- 📍 **Pelacakan pengiriman live** — status berjalan otomatis: Dikonfirmasi → Disiapkan → Dalam Perjalanan → Tiba (simulasi berbasis waktu)

## 🧱 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 3 |
| State | React Context + `localStorage` |

## 🚀 Menjalankan

```bash
# Install dependencies
npm install

# Salin env contoh lalu isi kredensial Xendit (lihat bagian di bawah)
cp .env.example .env.local

# Mode pengembangan (http://localhost:3000)
npm run dev

# Build produksi
npm run build
npm run start
```

## 💳 Integrasi Pembayaran (Xendit)

Checkout menggunakan **Xendit Invoice** — halaman pembayaran hosted yang mendukung Virtual Account, e-wallet, QRIS, kartu, dan retail outlet sekaligus. Pola integrasinya **tanpa database** (Opsi A): aplikasi membuat invoice, mengarahkan pengguna ke halaman bayar Xendit, lalu memverifikasi status saat pengguna kembali.

### Alur

```
Checkout → POST /api/checkout → Xendit Create Invoice → redirect ke invoice_url
   → user bayar → redirect balik ke /orders/[id]?payment=success
   → GET /api/invoice-status memverifikasi status → order ditandai "Lunas"
```

### Setup

1. Buat akun di [xendit.co](https://www.xendit.co) dan ambil **Secret API Key** (Settings → API Keys). Gunakan key **TEST** (`xnd_development_...`) untuk uji coba.
2. Untuk lokal, buat file `.env.local`:
   ```env
   XENDIT_SECRET_KEY=xnd_development_xxxxxxxxxxxx
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
3. Untuk produksi (Vercel): buka **Project → Settings → Environment Variables**, tambahkan:
   - `XENDIT_SECRET_KEY` → secret key Anda
   - `NEXT_PUBLIC_BASE_URL` → `https://satset-groceries.vercel.app`

   Lalu **Redeploy** agar variabel terpakai.

> ⚠️ **Jangan pernah** menaruh secret key di kode atau meng-commit-nya. Key hanya dipakai di server (API routes), tidak pernah terekspos ke browser.

### Endpoint API

| Route | Fungsi |
|-------|--------|
| `POST /api/checkout` | Membuat invoice Xendit, mengembalikan `invoiceUrl` |
| `GET /api/invoice-status?id=<invoiceId>` | Mengecek status pembayaran invoice |

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header, footer, providers)
│   ├── page.tsx            # Beranda (katalog)
│   ├── cart/page.tsx       # Keranjang
│   ├── checkout/page.tsx   # Checkout + buat invoice Xendit
│   ├── orders/
│   │   ├── page.tsx        # Riwayat pesanan
│   │   └── [id]/page.tsx   # Detail + status bayar + pelacakan pengiriman
│   └── api/
│       ├── checkout/route.ts        # Buat invoice Xendit
│       └── invoice-status/route.ts  # Cek status pembayaran
├── components/             # Header, Footer, Catalog, PaymentStatusBanner, dll.
├── context/                # CartContext, OrdersContext
└── lib/                    # data (produk), types, helpers, xendit client
```

## 🔭 Pengembangan Selanjutnya (ide)

- Autentikasi & akun pengguna (mis. Supabase/Auth.js)
- Backend + database nyata untuk produk, stok, dan pesanan
- Integrasi pembayaran sungguhan (Midtrans / Xendit)
- Dark store per lokasi + stok real-time berbasis lokasi
- Aplikasi kurir & dashboard admin/operasi
- Peta & pelacakan kurir real-time

---

> Catatan: Ini adalah **MVP demo** untuk keperluan pembelajaran/prototipe. Bukan produk siap produksi.
