const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Sample products based on your existing static data
const sampleProducts = [
  {
    nama: 'Kaos polos blue light pria/wanita',
    harga: 50000,
    hargaAsli: 70000,
    kategori: 'fashion',
    deskripsi: 'Kaos polos berwarna biru light yang cocok untuk pria dan wanita. Bahan nyaman dan adem.',
    kondisi: 'Bekas',
    berat: '200 g',
    gambar: ['./img/menu/fashion/fashion4.jpg'],
    lokasi: 'Kab. Batang',
    stok: 10,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: true
  },
  {
    nama: 'Kaos Switer tebal wanita',
    harga: 90000,
    hargaAsli: 100000,
    kategori: 'fashion',
    deskripsi: 'Switer tebal khusus wanita, bahan hangat dan nyaman dipakai.',
    kondisi: 'Bekas',
    berat: '400 g',
    gambar: ['./img/menu/fashion/fashion5.jpg'],
    lokasi: 'Kab. Batang',
    stok: 8,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: true
  },
  {
    nama: 'Makeup 7 Pcs Makeup set Beauty Bundling',
    harga: 155000,
    hargaAsli: 170000,
    kategori: 'makeup',
    deskripsi: 'Paket makeup lengkap 7 pcs untuk kecantikan Anda. Cocok untuk pemula.',
    kondisi: 'Baru',
    berat: '500 g',
    gambar: ['./img/menu/makeup/makeup1.jpg'],
    lokasi: 'Kab. Batang',
    stok: 15,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: true
  },
  {
    nama: 'Lipen red light beauty',
    harga: 50000,
    hargaAsli: 70000,
    kategori: 'makeup',
    deskripsi: 'Lipstik warna merah light yang cantik dan tahan lama.',
    kondisi: 'Baru',
    berat: '50 g',
    gambar: ['./img/menu/makeup/makeup2.jpg'],
    lokasi: 'Kab. Batang',
    stok: 20,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: true
  },
  {
    nama: 'Penghilang jerawat dalam sekejap',
    harga: 70000,
    hargaAsli: 90000,
    kategori: 'makeup',
    deskripsi: 'Produk penghilang jerawat yang efektif dan cepat.',
    kondisi: 'Baru',
    berat: '100 g',
    gambar: ['./img/menu/makeup/makeup5.jpg'],
    lokasi: 'Kab. Batang',
    stok: 12,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: true
  },
  {
    nama: 'Jaket wanita stylish',
    harga: 120000,
    hargaAsli: 150000,
    kategori: 'fashion',
    deskripsi: 'Jaket wanita dengan desain stylish dan modern.',
    kondisi: 'Bekas',
    berat: '350 g',
    gambar: ['./img/menu/fashion/fashion1.jpg'],
    lokasi: 'Kab. Batang',
    stok: 5,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: false
  },
  {
    nama: 'Pisang Kapas Matang',
    harga: 50000,
    hargaAsli: 60000,
    kategori: 'food',
    deskripsi: 'Pisang kapas matang yang manis dan lezat. Siap konsumsi.',
    kondisi: 'Baru',
    berat: '900 g',
    gambar: ['./img/menu/food/food5.jpg', './img/menu/food1/pisang_food.jpg'],
    lokasi: 'Kab. Batang',
    stok: 10,
    terjual: 0,
    rating: 0,
    tenggatWaktu: 'Batas 25 - 30 jul',
    isFeatured: false
  }
];

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      harga INTEGER NOT NULL,
      harga_asli INTEGER NOT NULL,
      kategori VARCHAR(50) NOT NULL,
      deskripsi TEXT NOT NULL,
      kondisi VARCHAR(20) NOT NULL,
      berat VARCHAR(50) DEFAULT '0 g',
      gambar JSONB DEFAULT '[]',
      lokasi VARCHAR(255) DEFAULT 'Kab. Batang',
      stok INTEGER DEFAULT 10,
      terjual INTEGER DEFAULT 0,
      rating NUMERIC(3,2) DEFAULT 0,
      tenggat_waktu VARCHAR(255) DEFAULT '',
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
    throw err;
  }
}

async function seedDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL');

    // Create table if not exists
    await createTable();

    // Clear existing data
    await client.query('DELETE FROM products');
    console.log('Cleared existing products');

    // Insert sample products
    for (const product of sampleProducts) {
      await client.query(
        `INSERT INTO products (nama, harga, harga_asli, kategori, deskripsi, kondisi, berat, gambar, lokasi, stok, terjual, rating, tenggat_waktu, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          product.nama,
          product.harga,
          product.hargaAsli,
          product.kategori,
          product.deskripsi,
          product.kondisi,
          product.berat,
          JSON.stringify(product.gambar),
          product.lokasi,
          product.stok,
          product.terjual,
          product.rating,
          product.tenggatWaktu,
          product.isFeatured
        ]
      );
    }

    console.log(`Inserted ${sampleProducts.length} products`);
    console.log('Database seeding completed!');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

seedDatabase();
