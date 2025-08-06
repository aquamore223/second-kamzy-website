import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ✅ 1. Update Cart Count Icon
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.querySelector(".cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = totalItems;
  }
}

// ✅ 2. Add to Cart Function
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ✅ 3. Load Products for Each Category
async function loadCategory(category, containerId) {
  const q = query(
    collection(db, "products"),
    where("category", "==", category),
    orderBy("createdAt", "desc"),
    limit(4)
  );

  try {
    const snapshot = await getDocs(q);
    const container = document.getElementById(containerId);

    snapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.classList.add("product-item");

      card.innerHTML = `
        <a href="${category}.html" class="product-link">
          <img src="${data.imageUrl}" alt="${data.name}" />
          <h4>${data.name}</h4>
          <p>₦${parseFloat(data.price).toFixed(2)}</p>
        </a>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;

      const addToCartBtn = card.querySelector(".add-to-cart-btn");
      addToCartBtn.addEventListener("click", () => {
        const product = {
          id: doc.id,
          name: data.name,
          price: parseFloat(data.price),
          imageUrl: data.imageUrl,
          category: data.category,
        };
        addToCart(product);
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error(`❌ Failed to load ${category}:`, err);
  }
}

// ✅ 4. On Page Load
document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    "tops",
    "jeans",
    "joggers",
    "underwear",
    "slides",
    "shoes",
    "accessories"
  ];

  categories.forEach((cat) => loadCategory(cat, `${cat}-preview`));

  updateCartCount(); // Initial cart count update
});
