import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

console.log("📦 category-page.js loaded");

// 🛒 Retry-safe cart count update
function updateCartCountSafe() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartBadge = document.getElementById("cart-count");
  if (cartBadge) {
    cartBadge.textContent = totalQuantity > 0 ? totalQuantity : "";
    cartBadge.style.display = totalQuantity > 0 ? "inline-block" : "none";
    return true; // Found and updated
  }
  return false; // Badge not yet loaded
}

// 🔁 Keep trying until header is loaded
function retryCartCountUpdate() {
  if (!updateCartCountSafe()) {
    setTimeout(retryCartCountUpdate, 100); // Retry every 100ms until header exists
  }
}

// ✅ Add to Cart logic
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

  // Instant badge update
  retryCartCountUpdate();
}
window.addToCart = addToCart;

// 📦 Load products for category
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
        <p>₦${parseFloat(data.price).toLocaleString()}</p>
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

// 🖱 Handle click on dynamically loaded "Add to Cart" buttons
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const btn = e.target;
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      image: btn.dataset.image
    };

    addToCart(product);

    // ✅ Show "Added!" feedback
    btn.textContent = "✅ Added!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.disabled = false;
    }, 1500);
  }
});

// ✅ On page load, try updating the count (in case cart already has items)
retryCartCountUpdate();
