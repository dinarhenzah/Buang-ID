# Database Produk BuangID dengan PostgreSQL

Proyek ini telah diintegrasikan dengan database PostgreSQL untuk mengelola produk secara dinamis.

## Struktur File yang Dibuat

### Backend (Server)
- `server.js` - Server Express.js dengan API endpoints
- `seed.js` - Script untuk mengisi database dengan data sample dan membuat tabel
- `.env` - Konfigurasi environment (PostgreSQL connection string dan PORT)

### Frontend
- `script/api.js` - JavaScript client untuk berkomunikasi dengan API
- `produk/detail.html` - Halaman detail produk yang dinamis

## Cara Menggunakan

### 1. Install PostgreSQL

Pastikan PostgreSQL sudah terinstall dan berjalan di sistem Anda:

**Untuk Linux/Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Untuk Windows:**
Download installer dari https://www.postgresql.org/download/windows/
Setelah install, pastikan service PostgreSQL berjalan.

**Untuk macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Untuk Docker:**
```bash
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=password postgres:latest
```

### 2. Buat Database

Masuk ke PostgreSQL:
```bash
sudo -u postgres psql
```

Atau di Windows:
```bash
psql -U postgres
```

Kemudian jalankan perintah SQL berikut:
```sql
CREATE DATABASE buangid;
```

Keluar dari PostgreSQL:
```sql
\q
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Konfigurasi Environment

Edit file `.env` sesuai dengan konfigurasi PostgreSQL Anda:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/buangid
PORT=3000
```

Ganti `password` dengan password PostgreSQL Anda.

### 5. Isi Database dengan Data Sample

```bash
npm run seed
```

Ini akan:
- Membuat tabel `products` jika belum ada
- Menghapus data lama (jika ada)
- Memasukkan 7 produk sample

### 6. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### 7. Akses Aplikasi

Buka browser dan akses:
- Homepage: `http://localhost:3000/index.html`
- Detail Produk: `http://localhost:3000/produk/detail.html?id=<PRODUCT_ID>`

## API Endpoints

### GET /api/products
Mengambil semua produk

### GET /api/products/featured
Mengambil produk unggulan (rekomendasi)

### GET /api/products/category/:kategori
Mengambil produk berdasarkan kategori (fashion, makeup, food, dll)

### GET /api/products/:id
Mengambil detail produk berdasarkan ID

### POST /api/products
Menambah produk baru

### PUT /api/products/:id
Update produk

### DELETE /api/products/:id
Hapus produk

## Schema Tabel Products

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | SERIAL PRIMARY KEY | ID unik produk |
| nama | VARCHAR(255) | Nama produk |
| harga | INTEGER | Harga jual |
| harga_asli | INTEGER | Harga coret |
| kategori | VARCHAR(50) | Kategori (fashion, makeup, food, dll) |
| deskripsi | TEXT | Deskripsi produk |
| kondisi | VARCHAR(20) | Kondisi (Baru/Bekas) |
| berat | VARCHAR(50) | Berat produk |
| gambar | JSONB | Array URL gambar |
| lokasi | VARCHAR(255) | Lokasi penjual |
| stok | INTEGER | Jumlah stok |
| terjual | INTEGER | Jumlah terjual |
| rating | NUMERIC(3,2) | Rating produk |
| tenggat_waktu | VARCHAR(255) | Batas waktu promo |
| is_featured | BOOLEAN | Produk unggulan |
| created_at | TIMESTAMP | Tanggal dibuat |

## Mengubah Kode Statis ke Dinamis

### Di Homepage (index.html)
File `index.html` sudah ditambahkan script `api.js` yang akan:
- Mengambil produk featured dari database
- Menampilkannya di swiper carousel secara otomatis

### Di Halaman Detail
Gunakan `produk/detail.html?id=<PRODUCT_ID>` untuk melihat detail produk yang diambil dari database.

## Contoh Menambah Produk Baru via API

```javascript
fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nama: 'Produk Baru',
    harga: 100000,
    hargaAsli: 150000,
    kategori: 'fashion',
    deskripsi: 'Deskripsi produk baru',
    kondisi: 'Baru',
    berat: '500 g',
    gambar: ['./img/menu/fashion/fashion1.jpg'],
    lokasi: 'Jakarta',
    stok: 20,
    isFeatured: true
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Catatan Penting

1. Pastikan PostgreSQL sudah berjalan sebelum menjalankan server
2. Ubah `DATABASE_URL` di file `.env` jika menggunakan konfigurasi berbeda
3. Untuk production, gunakan environment variables yang aman
4. File HTML statis lama masih bisa digunakan, tapi disarankan beralih ke halaman dinamis
5. Field `gambar` disimpan sebagai JSONB dalam format array

## Troubleshooting

**Error: Connection refused**
- Pastikan PostgreSQL service berjalan
- Cek koneksi di file `.env`

**Error: Authentication failed**
- Periksa username dan password di file `.env`
- Default user adalah `postgres`

**Error: Database does not exist**
- Buat database dengan perintah: `createdb -U postgres buangid`

**Error: Port already in use**
- Ubah PORT di file `.env` ke port lain
- Atau hentikan proses yang menggunakan port 3000

**Produk tidak muncul**
- Jalankan `npm run seed` untuk mengisi database
- Cek console browser untuk error
