console.log("🛒 cart.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});

// ✅ Event Delegation for Add to Cart (works instantly without refresh)
document.addEventListener("click", e => {
  const button = e.target.closest(".add-to-cart");
  if (!button) return;

  const product = {
    name: button.dataset.name,
    price: parseFloat(button.dataset.price),
    imageUrl: button.dataset.image,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const existingIndex = cart.findIndex(item => item.name === product.name);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("kamzyCart", JSON.stringify(cart));
  renderCart();
  updateCartCount();

  // Optional feedback
  button.textContent = "✅ Added!";
  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 1500);
});

function renderCart() {
  const cartContainer = document.getElementById("cartSection");
  const cartTotalDisplay = document.getElementById("cartTotal");
  const clearBtn = document.getElementById("clearCartBtn");

  if (!cartContainer) return;

  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

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

  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    };
  }
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

  // Checkout (WhatsApp)
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      checkoutViaWhatsApp();
    });
  }
}

function updateCartCount() {
  const cartCountEl = document.querySelector(".cart-count");
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }
}

// 📲 WhatsApp Checkout Function
function checkoutViaWhatsApp() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "🛒 *Kamzy Wardrobe Order*\n\n";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - ₦${item.price.toLocaleString()} x ${item.quantity}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n💰 *Total:* ₦${total.toLocaleString()}\n\nPlease confirm my order. 🙏`;

  const phoneNumber = "2348102677362"; // ✅ Your WhatsApp number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");

  // 🧹 Clear cart after sending
  localStorage.removeItem("kamzyCart");
  renderCart();
  updateCartCount();
}
