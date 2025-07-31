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
}


document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    { file: 'tops.html', sourceId: 'tops-section', targetId: 'tops-preview' },
    { file: 'jeans.html', sourceId: 'jeans-section', targetId: 'jeans-preview' },
    { file: 'joggers.html', sourceId: 'joggers-section', targetId: 'joggers-preview' },
    { file: 'underwear.html', sourceId: 'underwear-section', targetId: 'underwear-preview' },
    { file: 'accessories.html', sourceId: 'accessories-section', targetId: 'accessories-preview' },
    { file: 'slides.html', sourceId: 'slides-section', targetId: 'slides-preview' },
    { file: 'shoes.html', sourceId: 'shoes-section', targetId: 'shoes-preview' },
  ];

  sections.forEach(({ file, sourceId, targetId }) => {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const section = temp.querySelector(`#${sourceId}`);

        if (section) {
          // Clone only the section so we don't affect the original
          const limitedSection = section.cloneNode(true);
          const limitedGrid = limitedSection.querySelector('.product-grid');

          // Remove extra items from the cloned grid
          const productItems = limitedGrid.querySelectorAll('.product-item');
          productItems.forEach((item, index) => {
            if (index >= 4) {
              item.remove();
            }
          });

          // Append cleaned clone to the target
          document.getElementById(targetId).appendChild(limitedSection);
        }
      })
      .catch(err => console.error(`Error loading ${file}:`, err));
  });
});


