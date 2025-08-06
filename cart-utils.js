

// ✅ Updates the red cart count icon
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElem = document.querySelector(".cart-count");
  if (cartCountElem) {
    cartCountElem.textContent = totalItems;
  }
}
