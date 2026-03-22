document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // GET ELEMENTS FROM HTML
  // =========================
  const hamburgerButton = document.getElementById("hamburgerButton");
  const dropdownMenu = document.getElementById("dropdownMenu");

  const sidebarButtons = document.querySelectorAll(".sidebar-link");

  const signinButton = document.getElementById("signinButton");
  const userDisplay = document.getElementById("userDisplay");

  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");

  const modal = document.getElementById("productModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalPrice = document.getElementById("modalPrice");
  const closeModal = document.getElementById("closeModal");
  const nextBtn = document.getElementById("nextImage");
  const prevBtn = document.getElementById("prevImage");
  const modalAddToCart = document.getElementById("modalAddToCart");

  const cards = document.querySelectorAll(".card");

  // =========================
  // VARIABLES FOR MODAL
  // =========================
  let currentImages = [];
  let currentIndex = 0;
  let currentProduct = null;

  // =========================
  // CART FUNCTIONS
  // =========================

  // Get cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Update the cart count in the top bar
  function updateCartCount() {
    if (!cartCount) return;

    const cart = getCart();

    const totalItems = cart.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
  }

  // Add selected product to cart
  function addToCart(product) {
    const cart = getCart();

    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    saveCart(cart);
    updateCartCount();
    alert(product.name + " added to cart!");
  }

  // =========================
  // MODAL IMAGE FUNCTION
  // =========================
  function showImage() {
    if (!modalImage || currentImages.length === 0) return;
    modalImage.src = currentImages[currentIndex];
  }

  // Load the correct cart count immediately when page opens
  updateCartCount();

  // =========================
  // HAMBURGER MENU
  // =========================
  if (hamburgerButton && dropdownMenu) {
    hamburgerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
      if (
        !dropdownMenu.contains(event.target) &&
        !hamburgerButton.contains(event.target)
      ) {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  // =========================
  // SIDEBAR BUTTONS
  // =========================
  sidebarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionName = button.dataset.section;
      const targetSection = document.getElementById(sectionName);

      if (targetSection) {
        const topOffset = 60;
        const targetPosition =
          targetSection.getBoundingClientRect().top +
          window.pageYOffset -
          topOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // =========================
  // SIGN IN BUTTON
  // =========================
  if (signinButton && userDisplay) {
    signinButton.addEventListener("click", () => {
      const firstName = "Don Ian";
      userDisplay.textContent = firstName;
    });
  }

  // =========================
  // PRODUCT CARD CLICK
  // =========================
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const imagesData = card.dataset.images || "[]";

      try {
        currentImages = JSON.parse(imagesData);
      } catch (error) {
        currentImages = [];
      }

      currentIndex = 0;

      currentProduct = {
        name: card.dataset.name || "Product",
        price: Number(card.dataset.price || 0),
        image: currentImages[0] || ""
      };

      if (modalName) {
        modalName.textContent = currentProduct.name;
      }

      if (modalPrice) {
        modalPrice.textContent = "₱" + currentProduct.price;
      }

      showImage();

      if (modal) {
        modal.classList.add("show");
      }
    });
  });

  // =========================
  // CLOSE MODAL
  // =========================
  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  // =========================
  // NEXT IMAGE BUTTON
  // =========================
  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (currentImages.length > 1) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage();
      }
    });
  }

  // =========================
  // PREVIOUS IMAGE BUTTON
  // =========================
  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (currentImages.length > 1) {
        currentIndex =
          (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage();
      }
    });
  }

  // =========================
  // ADD TO CART FROM MODAL
  // =========================
  if (modalAddToCart) {
    modalAddToCart.addEventListener("click", () => {
      if (!currentProduct) return;

      currentProduct.image = currentImages[currentIndex] || currentProduct.image;
      addToCart(currentProduct);
    });
  }

  // =========================
  // CART BUTTON
  // =========================
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
});