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

    snapshot.forEach((doc) => {
      const data = doc.data();

      const card = document.createElement("div");  // ✅ FIX: define 'card' here
      card.classList.add("product-item");
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h4>${data.name}</h4>
        <p>$${data.price}</p>
        <button>Add to Cart</button>
      `;

      container.appendChild(card);
    });

    if (snapshot.empty) {
      console.log("ℹ️ No products found for", category);
    }
  } catch (err) {
    console.error("❌ Error loading products:", err);
  }
});
