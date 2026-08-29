/* ==========================================================================
   CircuitCart — cart-script.js
   Reads the cart out of localStorage (see cart-storage.js) and renders it:
   one card per item, plus a live order summary. Update and Delete both
   re-run renderCart() afterwards, so the whole page always matches
   whatever is currently saved.
   ========================================================================== */

const TAX_RATE = 0.10;

function renderCart() {
  const cart = getCart();
  const itemsContainer = document.getElementById("cartItems");
  const heading = document.getElementById("cartHeading");
  const summaryContainer = document.getElementById("orderSummary");

  heading.textContent = `My Cart (${cart.length} item${cart.length === 1 ? "" : "s"})`;

  // Empty cart: show a simple message instead of the item list + summary.
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty.</p>
        <a href="index.html">Continue shopping</a>
      </div>
    `;
    summaryContainer.innerHTML = "";
    summaryContainer.style.display = "none";
    return;
  }

  summaryContainer.style.display = "";

  // ---------- Render each item card ----------
  itemsContainer.innerHTML = cart
    .map((item) => {
      const lineTotal = item.price * item.qty;

      return `
        <article class="cart-item" data-id="${item.id}">
          <div class="cart-item__image-col">
            <img src="${item.image}" alt="${item.name}">
            <p class="cart-item__unit-price">${formatFCFA(item.price)}</p>
          </div>
          <div class="cart-item__details">
            <h2>${item.name}</h2>
            <p class="cart-item__line-total">${formatFCFA(lineTotal)}</p>
            <div class="cart-item__qty-row">
              <label for="qty-${item.id}">Quantity:</label>
              <input type="number" class="qty-select" id="qty-${item.id}" min="1" max="99" step="1" value="${item.qty}">
              <button class="link-btn link-btn--update" data-action="update" data-id="${item.id}">Update</button>
              <button class="link-btn link-btn--delete" data-action="delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // ---------- Render the order summary ----------
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = 0;
  const totalBeforeTax = subtotal + shipping;
  const tax = totalBeforeTax * TAX_RATE;
  const orderTotal = totalBeforeTax + tax;

  summaryContainer.innerHTML = `
    <h2>Order Summary</h2>
    <div class="order-summary__row">
      <span>Items(${cart.length}):</span>
      <span>${formatFCFA(subtotal)}</span>
    </div>
    <div class="order-summary__row">
      <span>Shipping &amp; handling:</span>
      <span>${formatFCFA(shipping)}</span>
    </div>
    <hr class="order-summary__divider">
    <div class="order-summary__row">
      <span>Total before tax:</span>
      <span>${formatFCFA(totalBeforeTax)}</span>
    </div>
    <div class="order-summary__row">
      <span>Estimate tax(${TAX_RATE * 100}%):</span>
      <span>${formatFCFA(tax)}</span>
    </div>
    <hr class="order-summary__divider">
    <div class="order-summary__row order-summary__row--total">
      <span>Order Total:</span>
      <span>${formatFCFA(orderTotal)}</span>
    </div>
  `;

  updateCartBadge();
}

/* ---------- Handle Update / Delete clicks (event delegation) ---------- */

function setUpCartActions() {
  const itemsContainer = document.getElementById("cartItems");

  itemsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (action === "delete") {
      saveCart(cart.filter((i) => i.id !== id));
      renderCart();
    }

    if (action === "update") {
      const input = document.getElementById(`qty-${id}`);
      item.qty = clampQty(input.value);
      saveCart(cart);
      renderCart();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setUpCartActions();
});
