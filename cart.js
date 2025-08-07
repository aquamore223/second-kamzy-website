console.log("🛒 cart.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  // Clear Cart button (if it exists)
  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
});

function renderCart() {
  const cartContainer = document.getElementById("cartSection");
  const cartTotalDisplay = document.getElementById("cartTotal");
  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

  if (!cartContainer) {
    console.warn("⚠️ cartSection container not found.");
    return;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalDisplay) cartTotalDisplay.textContent = "0.00";
    return;
  }

  let total = 0;

  cartContainer.innerHTML = `
    <ul class="cart-items">
      ${cart
        .map((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          return `
            <li class="cart-item">
              <img src="${item.imageUrl}" alt="${item.name}" />
              <div class="cart-details">
                <h4>${item.name}</h4>
                <p>₦${item.price.toFixed(2)} × ${item.quantity} = ₦${itemTotal.toFixed(2)}</p>
                <button class="increase" data-index="${index}">+</button>
                <button class="decrease" data-index="${index}">-</button>
                <button class="remove" data-index="${index}">Remove</button>
              </div>
            </li>
          `;
        })
        .join("")}
    </ul>
    <button id="checkoutBtn">Checkout</button>
  `;

  if (cartTotalDisplay) cartTotalDisplay.textContent = total.toFixed(2);

  setupCartButtons(cart);
}

function setupCartButtons(cart) {
  // Increase
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      cart[index].quantity += 1;
      localStorage.setItem("kamzyCart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  // Decrease
  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      localStorage.setItem("kamzyCart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  // Remove
  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("kamzyCart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  // Checkout
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("✅ Thanks for shopping with Kamzy Wardrobe!");
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
}

// Updates the cart icon count (in nav)
function updateCartCount() {
  const cartCountEl = document.querySelector(".cart-count");
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }
}
