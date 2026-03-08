const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// In-memory data (in production, use a database)
let products = [
  { id: 1, name: "Thepoxy 2:1 Top Coat Resin", price: 1300, category: "Resin", description: "Premium top coat resin for finishing art projects" },
  { id: 2, name: "Lacing White Opaque Pigment", price: 60, category: "Pigments", description: "White opaque pigment for coloring resins" },
  { id: 3, name: "Turquoise Ink Pigment", price: 60, category: "Pigments", description: "Turquoise ink pigment for artistic creations" },
  { id: 4, name: "Thepoxy Gloss Casting Resin 3:1", price: 1350, category: "Resin", description: "Gloss casting resin for detailed molds" },
  { id: 5, name: "Brown Boat 50 MM", price: 40, category: "Miniatures", description: "Brown boat miniature for dioramas" },
  { id: 6, name: "Crystal Heart Pendant", price: 250, category: "Jewellery", description: "Beautiful crystal heart pendant with silver chain" },
  { id: 7, name: "Floral Resin Pendant", price: 180, category: "Jewellery", description: "Elegant floral design pendant in clear resin" },
  { id: 8, name: "Butterfly Wing Pendant", price: 320, category: "Jewellery", description: "Unique butterfly wing pendant with gold accents" },
  { id: 9, name: "Ocean Wave Pendant", price: 290, category: "Jewellery", description: "Stunning ocean wave design in blue resin" },
  { id: 10, name: "Moon Phase Pendant", price: 350, category: "Jewellery", description: "Celestial moon phase pendant with silver chain" },
  { id: 11, name: "Rose Petal Pendant", price: 220, category: "Jewellery", description: "Delicate rose petal pendant in pink resin" },
  { id: 12, name: "Starlight Pendant", price: 280, category: "Jewellery", description: "Sparkling starlight design pendant" }
];

let cart = [];
let users = [];
let newsletter = [];

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const categoryProducts = products.filter(p => p.category.toLowerCase() === req.params.category.toLowerCase());
  res.json(categoryProducts);
});

// Search products
app.get('/api/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  res.json(results);
});

// Cart routes
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id == productId);
  if (product) {
    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/cart/:id', (req, res) => {
  cart = cart.filter(item => item.id != req.params.id);
  res.json(cart);
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!newsletter.includes(email)) {
    newsletter.push(email);
    res.json({ message: 'Subscribed successfully' });
  } else {
    res.status(400).json({ message: 'Already subscribed' });
  }
});

// User registration (simple, no password hashing for demo)
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
  } else {
    users.push({ email, password });
    res.json({ message: 'User registered successfully' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ message: 'Login successful', user: { email } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});