document.addEventListener("DOMContentLoaded", () => {
  // Load nav and footer
  Promise.all([
    fetch("nav.html").then(res => res.text()),
    fetch("footer.html").then(res => res.text())
  ])
    .then(([navHTML, footerHTML]) => {
      document.querySelector("header").innerHTML = navHTML;
      document.querySelector("footer").innerHTML = footerHTML;

      // Once loaded, initialize interactivity
      setupNavAndSearch();

      // Highlight the active page link (case-insensitive, handles folder paths)
const currentPage = window.location.pathname.split("/").pop().toLowerCase();

document.querySelectorAll(".nav-links a").forEach(link => {
  const linkHref = link.getAttribute("href").toLowerCase();

  if (linkHref === currentPage || (currentPage === "" && linkHref.includes("index"))) {
    link.classList.add("active");
  }
});

    });
});

function setupNavAndSearch() {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const closeBtn = document.getElementById("close-btn");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");
  const navLinks = document.querySelectorAll(".nav-links a");
  const footer = document.querySelector("footer");

  // Menu toggle
  if (menuToggle && menu && closeBtn) {
    menuToggle.addEventListener("click", () => {
      menu.classList.add("active");
      closeBtn.style.display = "block";
      document.body.classList.add("no-scroll");
      if (footer) footer.style.display = "none"; 
    });

    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
      closeBtn.style.display = "none";
      document.body.classList.remove("no-scroll");
      if (footer) footer.style.display = "block";
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        closeBtn.style.display = "none";
        document.body.classList.remove("no-scroll");
        if (footer) footer.style.display = "block";
      });
    });
  }

  // Search toggle
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) {
        searchInput.focus();
      } else {
        searchInput.value = "";
      }
    });

    // Close search on outside click
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !searchIcon.contains(e.target) &&
        searchInput.classList.contains("active")
      ) {
        searchInput.classList.remove("active");
        searchInput.value = "";
      }
    });

    // Focus search input with "/" key
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        searchInput.classList.add("active");
        searchInput.focus();
      }
    });
  }

  // Sticky header
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("stuck", window.scrollY > 10);
    });
  }

  // ===== CART SYSTEM =====

// Utility to get cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in nav
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElem = document.getElementById("cart-count");
  if (countElem) countElem.textContent = count;
}

// Add to cart from product preview
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const card = e.target.closest(".product-item");
    const name = card.querySelector("h4").textContent;
    const price = parseFloat(card.querySelector("p").textContent.replace("$", ""));
    const imageUrl = card.querySelector("img").src;

    const cart = getCart();
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, imageUrl, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    alert("✅ Added to cart!");
  }
});

// Render cart on cart.html
if (document.getElementById("cart-items")) {
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemElem = document.createElement("div");
    itemElem.className = "cart-item";
    itemElem.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="quantity-controls">
          <button class="decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="remove" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElem);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  updateCartCount();
}

// Quantity and remove controls
document.addEventListener("click", function (e) {
  const cart = getCart();
  const index = parseInt(e.target.dataset.index);

  if (e.target.classList.contains("increase")) {
    cart[index].quantity += 1;
  } else if (e.target.classList.contains("decrease")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  } else if (e.target.classList.contains("remove")) {
    cart.splice(index, 1);
  } else {
    return;
  }

  saveCart(cart);
  renderCart();
});

}



