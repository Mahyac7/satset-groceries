# ⚡ AstroMart — MVP Quick-Commerce Web App

Aplikasi web MVP ala **ASTRO** (on-demand grocery & essentials delivery) untuk Indonesia. Dibuat dengan Next.js + React + Tailwind CSS. Semua data produk dan pembayaran disimulasikan (tidak ada backend/transaksi nyata).

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

# Mode pengembangan (http://localhost:3000)
npm run dev

# Build produksi
npm run build
npm run start
```

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header, footer, providers)
│   ├── page.tsx            # Beranda (katalog)
│   ├── cart/page.tsx       # Keranjang
│   ├── checkout/page.tsx   # Checkout + pembayaran simulasi
│   └── orders/
│       ├── page.tsx        # Riwayat pesanan
│       └── [id]/page.tsx   # Detail + pelacakan pengiriman
├── components/             # Header, Footer, Catalog, ProductCard, dll.
├── context/                # CartContext, OrdersContext
└── lib/                    # data (produk), types, helpers, konstanta
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
