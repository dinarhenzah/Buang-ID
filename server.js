const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected');
  }
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured products (rekomendasi)
app.get('/api/products/featured', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_featured = true LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
app.get('/api/products/category/:kategori', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE kategori = $1', [req.params.kategori]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  const {
    nama, harga, hargaAsli, kategori, deskripsi, kondisi, berat, gambar,
    lokasi, stok, tenggatWaktu, isFeatured
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products (nama, harga, harga_asli, kategori, deskripsi, kondisi, berat, gambar, lokasi, stok, tenggat_waktu, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [nama, harga, hargaAsli, kategori, deskripsi, kondisi, berat, JSON.stringify(gambar), lokasi, stok, tenggatWaktu, isFeatured || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current product
    const currentResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = currentResult.rows[0];
    
    // Update fields if provided
    const updatedProduct = {
      nama: req.body.nama || product.nama,
      harga: req.body.harga !== undefined ? req.body.harga : product.harga,
      harga_asli: req.body.hargaAsli !== undefined ? req.body.hargaAsli : product.harga_asli,
      kategori: req.body.kategori || product.kategori,
      deskripsi: req.body.deskripsi || product.deskripsi,
      kondisi: req.body.kondisi || product.kondisi,
      berat: req.body.berat || product.berat,
      gambar: req.body.gambar ? JSON.stringify(req.body.gambar) : product.gambar,
      lokasi: req.body.lokasi || product.lokasi,
      stok: req.body.stok !== undefined ? req.body.stok : product.stok,
      terjual: req.body.terjual !== undefined ? req.body.terjual : product.terjual,
      rating: req.body.rating !== undefined ? req.body.rating : product.rating,
      tenggat_waktu: req.body.tenggatWaktu !== undefined ? req.body.tenggatWaktu : product.tenggat_waktu,
      is_featured: req.body.isFeatured !== undefined ? req.body.isFeatured : product.is_featured
    };

    const result = await pool.query(
      `UPDATE products SET
        nama = $1, harga = $2, harga_asli = $3, kategori = $4, deskripsi = $5,
        kondisi = $6, berat = $7, gambar = $8, lokasi = $9, stok = $10,
        terjual = $11, rating = $12, tenggat_waktu = $13, is_featured = $14
       WHERE id = $15 RETURNING *`,
      [
        updatedProduct.nama, updatedProduct.harga, updatedProduct.harga_asli,
        updatedProduct.kategori, updatedProduct.deskripsi, updatedProduct.kondisi,
        updatedProduct.berat, updatedProduct.gambar, updatedProduct.lokasi,
        updatedProduct.stok, updatedProduct.terjual, updatedProduct.rating,
        updatedProduct.tenggat_waktu, updatedProduct.is_featured, id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
