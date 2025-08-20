 // 🔄 Load shared header, footer, and cart
document.addEventListener("DOMContentLoaded", () => {
  // Load header
  fetch("nav.html")
    .then(res => res.text())
    .then(data => {
      document.querySelector("header").innerHTML = data;

      // ✅ Get current page name
      let currentPage = window.location.pathname.split("/").pop();
      if (currentPage === "" || currentPage === "/") {
        currentPage = "index.html"; // default homepage
      }

      // ✅ Highlight active link
      document.querySelectorAll("nav a").forEach(link => {
        let linkHref = link.getAttribute("href");

        // Handle cases like "/index.html"
        if (linkHref.startsWith("/")) {
          linkHref = linkHref.substring(1);
        }

        if (linkHref === currentPage) {
          link.classList.add("active");
        }
      });

      // Re-init nav functionality if needed
      if (typeof setupNavFunctionality === "function") {
        setupNavFunctionality();
      }
    })
    .catch(err => console.error("❌ Error loading nav:", err));

  // Load footer
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });

  // Render cart if on cart.html
  if (document.getElementById("cart-items")) {
    renderCart();
  }

  // Cart functions (apply only if defined)
  if (typeof setupClearCart === "function") setupClearCart();
  if (typeof setupCheckout === "function") setupCheckout();
});


// 🔁 Setup nav menu & search toggle
function setupNavFunctionality() {
  const menuToggle = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-btn");
  const menu = document.getElementById("menu");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");
  const cartIcon = document.getElementById("cart-icon");

  if (menuToggle && closeBtn && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.add("active");
      document.body.style.overflow = "hidden"; // Disable scroll
    });

    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
      document.body.style.overflow = ""; // Restore scroll
    });
  }

  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("show");
      searchInput.focus();
    });
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
}

// 🔗 Highlight current page in nav
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// 🛒 Add to Cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("kamzyCart", JSON.stringify(cart));
  updateCartCount();
}
window.addToCart = addToCart;

// 🔢 Update Cart Count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const countBadge = document.getElementById("cart-count");
  if (countBadge) {
    countBadge.textContent = totalQuantity > 0 ? totalQuantity : "";
    countBadge.style.display = totalQuantity > 0 ? "inline-block" : "none";
  }
}

// 🛍️ Render Cart Page
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("kamzyCart")) || [];
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>₦${item.price.toLocaleString()} x ${item.quantity} = ₦${itemTotal.toLocaleString()}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  // Setup remove button listeners
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("kamzyCart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });
}
window.renderCart = renderCart;

// 🗑️ Clear Cart
function setupClearCart() {
  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
}

// ✅ Checkout
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thanks for your order! 🛍");
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = {
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        imageUrl: button.dataset.image
      };

      addToCart(product); // Call function from cart.js

      // Optional: give instant feedback
      button.textContent = "✅ Added!";
      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 1500);
    });
  });
});
 