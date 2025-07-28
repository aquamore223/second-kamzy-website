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

  // Close menu when any nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      closeBtn.style.display = "none";
      document.body.classList.remove("no-scroll");
    });
  });

  // Toggle search input
  searchIcon.addEventListener("click", () => {
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    }
  });
});
