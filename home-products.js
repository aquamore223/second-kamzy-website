import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Helper to safely output text into HTML templates
 */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Load products for a category and render cards.
 * Buttons are created with class="add-to-cart" and data-* attributes
 * so the global cart.js event delegation picks them up instantly.
 */
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
    if (!container) return;

    snapshot.forEach((doc) => {
      const data = doc.data();

      const card = document.createElement("div");
      card.classList.add("product-item");

      // build the inner HTML; button uses class "add-to-cart" and data attributes
      card.innerHTML = `
        <a href="${escapeHtml(category)}.html" class="product-link">
          <img src="${escapeHtml(data.imageUrl || '')}" alt="${escapeHtml(data.name)}" />
          <h4>${escapeHtml(data.name)}</h4>
          <p>₦${parseFloat(data.price).toLocaleString()}</p>
        </a>

        <button
          class="add-to-cart"
          data-id="${escapeHtml(doc.id)}"
          data-name="${escapeHtml(data.name)}"
          data-price="${parseFloat(data.price)}"
          data-image="${escapeHtml(data.imageUrl || '')}"
          aria-label="Add ${escapeHtml(data.name)} to cart"
        >Add to Cart</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(`❌ Failed to load ${category}:`, err);
  }
}

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
});
