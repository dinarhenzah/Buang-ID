// Konfigurasi API URL
const API_URL = 'http://localhost:3000/api';

// Fungsi untuk memformat harga ke format Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}

// Fungsi untuk membuat HTML card produk
function createProductCard(product) {
  return `
    <div class="swiper-slide">
      <a href="./produk/detail.html?id=${product._id}" class="card item">
        <div class="card-header">
          <img src="${product.gambar[0]}" alt="${product.nama}">
        </div>
        <div class="teks">
          <h4>${product.nama}</h4>
          <h3>${formatRupiah(product.harga)}</h3>
          <div class="CB">
            <span class="badge">NEW</span>
            <span>${formatRupiah(product.hargaAsli)}</span>
          </div>
          <div class="kota">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-shield-fill-check" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647z"/>
            </svg>
            <p>${product.lokasi}</p>
          </div>
          <div class="ratting">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <p>${product.rating} | Terjual ${product.terjual}</p>
          </div>
          <div class="tenggat">${product.tenggatWaktu}</div>
        </div>
      </a>
    </div>
  `;
}

// Fungsi untuk load produk rekomendasi ke homepage
async function loadFeaturedProducts() {
  try {
    const response = await fetch(`${API_URL}/products/featured`);
    const products = await response.json();
    
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (swiperWrapper && products.length > 0) {
      swiperWrapper.innerHTML = products.map(product => createProductCard(product)).join('');
      
      // Re-initialize Swiper jika ada
      if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
          slidesPerView: 2,
          spaceBetween: 10,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

// Fungsi untuk load semua produk
async function loadAllProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error loading all products:', error);
    return [];
  }
}

// Fungsi untuk load produk berdasarkan kategori
async function loadProductsByCategory(kategori) {
  try {
    const response = await fetch(`${API_URL}/products/category/${kategori}`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error loading products by category:', error);
    return [];
  }
}

// Fungsi untuk load detail produk by ID
async function loadProductById(productId) {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error loading product detail:', error);
    return null;
  }
}

// Load featured products saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Cek apakah kita di halaman home (ada elemen swiper)
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (swiperWrapper) {
    loadFeaturedProducts();
  }
});
