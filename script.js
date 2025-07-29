document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const closeBtn = document.getElementById("close-btn");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Open menu
  menuToggle.addEventListener("click", () => {
    menu.classList.add("active");
    closeBtn.style.display = "block";
    document.body.classList.add("no-scroll");
  });

  // Close menu
  closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    closeBtn.style.display = "none";
    document.body.classList.remove("no-scroll");
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      closeBtn.style.display = "none";
      document.body.classList.remove("no-scroll");
    });
  });

  // Toggle search input
  searchIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from bubbling
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchInput.value = "";
    }
  });

  // Close search input when clicking outside
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
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('stuck');
  } else {
    header.classList.remove('stuck');
  }
});
