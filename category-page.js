import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Confirm script loaded
console.log("📦 category-page.js loaded");

// Wait for DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  const category = document.body.dataset.category;
  const container = document.getElementById(`${category}-all`);

  if (!category || !container) {
    console.warn("⚠️ Category or container not found");
    return;
  }

  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>No products found in this category.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      const card = document.createElement("div");
      card.classList.add("product-item");
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h4>${data.name}</h4>
        <p>₦${parseFloat(data.price).toFixed(2)}</p>
        <button class="add-to-cart-btn"
          data-id="${id}"
          data-name="${data.name}"
          data-price="${data.price}"
          data-image="${data.imageUrl}">
          Add to Cart
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Error loading products:", err);
  }
});

// ✅ Global click handler for dynamically loaded Add to Cart buttons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const btn = e.target;
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const image = btn.dataset.image;

    const product = { id, name, price, image };
    addToCart(product);
  }
});

// ✅ Add item to localStorage cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("kamzyCart", JSON.stringify(cart));
  updateCartCount();
}

// ✅ Update cart icon count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const cartIcon = document.querySelector(".cart-icon span");
  if (cartIcon) {
    cartIcon.textContent = count;
  }
}

// ✅ Call on load to show correct count
document.addEventListener("DOMContentLoaded", updateCartCount);
