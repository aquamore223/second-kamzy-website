// cart.js

// ✅ Update the Cart Icon Count
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const countBadge = document.getElementById("cart-count");

  if (countBadge) {
    if (totalQuantity > 0) {
      countBadge.style.display = "inline-block";
      countBadge.textContent = totalQuantity;
    } else {
      countBadge.style.display = "none";
      countBadge.textContent = "";
    }
  }
}

// ✅ Add to Cart
export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("kamzyCart", JSON.stringify(cart));
  updateCartCount();
}

// ✅ Remove from Cart
export function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("kamzyCart", JSON.stringify(cart));
  updateCartCount();
}

// ✅ Change Quantity (Used in cart page)
export function changeQuantity(productId, amount) {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    // remove if 0
    removeFromCart(productId);
  } else {
    localStorage.setItem("kamzyCart", JSON.stringify(cart));
    updateCartCount();
  }
}
