
import { updateCartCount } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container");
  const clearCartBtn = document.getElementById("clear-cart");
  const totalPriceElem = document.getElementById("total-price");
  const cartCountElem = document.querySelector(".cart-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceElem.textContent = "₦0.00";
      if (cartCountElem) cartCountElem.textContent = "0";
      return;
    }

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="cart-img" />
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₦${parseFloat(item.price).toFixed(2)}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    updateTotalPrice();
    updateCartCount();
  }

  function updateTotalPrice() {
    const total = cart.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.price),
      0
    );
    totalPriceElem.textContent = `₦${total.toFixed(2)}`;
  }

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElem) cartCountElem.textContent = totalItems;
  }

  // ✅ FIX: Clear cart properly
  clearCartBtn?.addEventListener("click", () => {
    localStorage.removeItem("cart");
   cart = [];
    renderCart();
    updateGlobalCartCount();  // <- this ensures other pages are synced

  });

  // Initial load
  renderCart();
});
