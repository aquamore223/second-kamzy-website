document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const closeBtn = document.getElementById("close-btn");
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");

  // Menu open
  menuToggle.addEventListener("click", () => {
    menu.classList.add("active");
    closeBtn.style.display = "block";
    document.body.classList.add("no-scroll");
  });

  // Menu close
  closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    closeBtn.style.display = "none";
    document.body.classList.remove("no-scroll");
  });

  // Toggle search bar
  searchIcon.addEventListener("click", () => {
    searchInput.classList.toggle("active");
    searchInput.classList.toggle("hidden");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    }
  });
});
