// Load products from backend
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    // For now, products are static in HTML, but can be dynamically loaded
    console.log('Products loaded:', products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Navigation scroll
document.querySelectorAll('.menu li').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.getAttribute('data-section');
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Category click - filter products
document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', async () => {
    const category = cat.getAttribute('data-category');
    try {
      const response = await fetch(`/api/products/category/${encodeURIComponent(category)}`);
      const products = await response.json();
      displayProducts(products, `Products in ${category}`);
    } catch (error) {
      console.error(`Error loading ${category} products:`, error);
    }
  });
});

// Function to display products
function displayProducts(products, title) {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return;

  // Update section title
  const sectionTitle = document.querySelector('#bestsellers .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = title;
  }

  if (products.length === 0) {
    productGrid.innerHTML = '<p>No products found.</p>';
    return;
  }

  const productsHtml = products.map(product => `
    <div class="product">
      <h4>${product.name}</h4>
      <p>Rs. ${product.price}.00</p>
      <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');

  productGrid.innerHTML = productsHtml;

  // Re-attach event listeners for new buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await addToCart(btn.getAttribute('data-product-id'), btn.getAttribute('data-product'));







      
    });
  });

  // Re-attach click listeners for product cards
  document.querySelectorAll('.product').forEach(card => {
    card.addEventListener('click', async () => {
      const button = card.querySelector('.add-to-cart');
      if (button) {
        await addToCart(button.getAttribute('data-product-id'), button.getAttribute('data-product'));
      }
    });
  });
}

// Explore All
document.getElementById('explore-all').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products, 'All Products');
  } catch (error) {
    console.error('Error loading all products:', error);
  }
});

// Add to Cart - now uses API
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent triggering product click
    await addToCart(btn.getAttribute('data-product-id'), btn.getAttribute('data-product'));
  });
});

// Make entire product cards clickable to add to cart
document.querySelectorAll('.product').forEach(card => {
  card.addEventListener('click', async () => {
    const button = card.querySelector('.add-to-cart');
    if (button) {
      await addToCart(button.getAttribute('data-product-id'), button.getAttribute('data-product'));
    }
  });
});

// Shared add to cart function
async function addToCart(productId, productName) {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const cart = await response.json();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartCount(totalQuantity);
    // Removed alert popup
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// Load initial cart count
async function loadCartCount() {
  try {
    const response = await fetch('/api/cart');
    const cart = await response.json();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartCount(totalQuantity);
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Update cart count - now takes total quantity
function updateCartCount(totalQuantity) {
  const cartIcon = document.getElementById('cart-icon');
  cartIcon.textContent = `🛒 (${totalQuantity})`;
}

// Search icon - now uses API
document.getElementById('search-icon').addEventListener('click', async () => {
  const query = prompt('Enter search query:');
  if (query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      displayProducts(results, `Search results for "${query}"`);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }
});

// User icon - navigate to profile page
document.getElementById('user-icon').addEventListener('click', () => {
  window.location.href = 'profile.html';
});

// Cart icon - navigate to cart page
document.getElementById('cart-icon').addEventListener('click', () => {
  window.location.href = 'cart.html';
});

// Newsletter - now uses API
document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    console.log('Newsletter subscription:', data.message);
    e.target.reset();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
  }
});

// Load initial data
loadProducts();
loadCartCount();