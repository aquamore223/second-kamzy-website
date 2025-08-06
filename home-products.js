import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Load first 4 products for a category
async function loadCategory(category, containerId) {
  const q = query(
    collection(db, "products"),
    where("category", "==", category),
    orderBy("createdAt", "desc"), // Optional: only if createdAt is valid
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
          <p>$${data.price}</p>
        </a>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(`❌ Failed to load ${category}:`, err);
  }
}

// Load previews into homepage
document.addEventListener("DOMContentLoaded", () => {
  loadCategory("tops", "tops-preview");
  loadCategory("jeans", "jeans-preview");
  loadCategory("joggers", "joggers-preview");
  loadCategory("underwear", "underwear-preview");
  loadCategory("slides", "slides-preview");
  loadCategory("shoes", "shoes-preview");
  loadCategory("accessories", "accessories-preview");
});
