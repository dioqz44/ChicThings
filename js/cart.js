document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // GET ELEMENTS FROM HTML
  // =========================
  const cartItemsContainer = document.getElementById("cartItems");
  const totalItemsDisplay = document.getElementById("totalItems");
  const totalAmount = document.getElementById("totalAmount");
  const cartCount = document.getElementById("cartCount");

  const signinButton = document.getElementById("signinButton");
  const userDisplay = document.getElementById("userDisplay");
  const cartButton = document.getElementById("cartButton");

  // =========================
  // CART HELPERS
  // =========================
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    if (!cartCount) return;

    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // =========================
  // RENDER CART
  // =========================
  function renderCart() {
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          Your cart is empty.
        </div>
      `;

      if (totalItemsDisplay) totalItemsDisplay.textContent = "0";
      if (totalAmount) totalAmount.textContent = "₱0";

      updateCartCount();
      return;
    }

    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      const cartItemHTML = `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">

          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">Price: ₱${item.price}</div>
            <div class="cart-item-price">₱${itemTotal}</div>

            <div class="cart-actions">
              <button class="qty-button subtract-button" data-index="${index}">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-button add-button" data-index="${index}">+</button>
              <button class="remove-button" data-index="${index}">Remove</button>
            </div>
          </div>

          <div class="cart-item-price">₱${itemTotal}</div>
        </div>
      `;

      cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });

    if (totalItemsDisplay) totalItemsDisplay.textContent = totalItems;
    if (totalAmount) totalAmount.textContent = `₱${total}`;

    updateCartCount();
    attachCartButtonEvents();
  }

  // =========================
  // CART BUTTON EVENTS
  // =========================
  function attachCartButtonEvents() {
    const addButtons = document.querySelectorAll(".add-button");
    const subtractButtons = document.querySelectorAll(".subtract-button");
    const removeButtons = document.querySelectorAll(".remove-button");

    // Add quantity
    addButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const cart = getCart();

        if (cart[index]) {
          cart[index].quantity += 1;
          saveCart(cart);
          renderCart();
        }
      });
    });

    // Subtract quantity
    subtractButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const cart = getCart();

        if (!cart[index]) return;

        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          saveCart(cart);
          renderCart();
        } else {
          const shouldRemove = confirm(
            `Are you sure you want to remove ${cart[index].name} from your cart?`
          );

          if (shouldRemove) {
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
          }
        }
      });
    });

    // Remove item
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const cart = getCart();

        if (!cart[index]) return;

        const shouldRemove = confirm(
          `Are you sure you want to remove ${cart[index].name} from your cart?`
        );

        if (shouldRemove) {
          cart.splice(index, 1);
          saveCart(cart);
          renderCart();
        }
      });
    });
  }

  // =========================
  // TEMPORARY SIGN IN BUTTON
  // =========================
  if (signinButton && userDisplay) {
    signinButton.addEventListener("click", () => {
      const firstName = "Don Ian";
      userDisplay.textContent = firstName;
    });
  }

  // =========================
  // CART BUTTON
  // =========================
  if (cartButton) {
    cartButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "cart.html";
    });
  }

  // =========================
  // INITIAL LOAD
  // =========================
  renderCart();
});
