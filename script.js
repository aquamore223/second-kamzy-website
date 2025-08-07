// 🔄 Load shared header and footer
document.addEventListener("DOMContentLoaded", () => {
  // Load header
 fetch("nav.html")
  .then(res => res.text())
  .then(data => {
    document.querySelector("header").innerHTML = data;
    setupNavFunctionality();      // Menu toggle, etc.
    setupSearchToggle();         // ✅ Attach search icon toggle
    highlightCurrentPage();
    updateCartCount();
  });

  // Load footer
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });

  // If on cart.html, render the cart
  if (document.getElementById("cart-items")) {
    renderCart();
  }
});


// 🔁 Setup nav menu & search toggle
function setupNavFunctionality() {
  const menuToggle = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-btn");
  const menu = document.getElementById("menu");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.querySelector(".search-input");
  const body = document.body;

  if (menuToggle && closeBtn && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.add("active");
      body.classList.add("no-scroll");
    });

    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
      body.classList.remove("no-scroll");
    });
  }
 if (searchIcon && searchInput) {
    console.log("Search toggle setup");
    searchIcon.addEventListener("click", () => {
      searchInput.classList.toggle("active");
      searchInput.focus();
    });
  } else {
    console.warn("Search elements not found");
  }
    
  }
  window.addEventListener("resize", () => {
  if (window.innerWidth >= 1200) {
    const menu = document.getElementById("menu");
    menu.classList.remove("active");
    document.body.classList.remove("no-scroll");
    }
});




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

// 🛒 Add to Cart (usable globally)
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

// ✅ Update Cart Count
function updateCartCount() {
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

// ✅ Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});


// 🗑️ Clear Cart
document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
});

// 🛍️ Render Cart Page Items
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

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>₦${item.price.toFixed(2)} x ${item.quantity} = ₦${itemTotal.toFixed(2)}</p>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}
window.renderCart = renderCart;

// ✅ Fake Checkout
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thanks for your order! 🛍");
      localStorage.removeItem("kamzyCart");
      renderCart();
      updateCartCount();
    });
  }
});
