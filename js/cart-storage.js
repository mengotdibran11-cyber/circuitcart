/* ==========================================================================
   CircuitCart — cart-storage.js
   Shared cart logic, loaded on BOTH index.html and cart.html (in that
   order, before each page's own script). This is what lets the cart
   page know what was added on the shop page, even though it opens in
   a separate tab/window: everything is saved to localStorage, which
   persists across pages (and browser reloads) on the same site.

   Cart shape saved in localStorage:
   [
     { id: "table-fan", name: "Table Fan", price: 15000, image: "images/product-table-fan.png", qty: 2 },
     ...
   ]
   ========================================================================== */

const CART_STORAGE_KEY = "circuitcart_cart";

// Shared price formatter, used on both index.html and cart.html so prices
// always look the same everywhere: 15000 -> "15 000 FCFA".
function formatFCFA(amount) {
  return `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;
}

// Keep quantity inputs sane: whole numbers between 1 and 99. Used on both
// the shop page (before adding to cart) and the cart page (on update),
// so someone can't submit "0", a negative number, blank, or "3.5".
function clampQty(value, { min = 1, max = 99 } = {}) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

// Turn a product name into a safe, stable id, e.g. "Table Fan" -> "table-fan"
function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

// Read the cart array out of localStorage. Returns [] if nothing is saved yet.
function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    // If the saved data is ever corrupted, don't crash the page - just reset it.
    return [];
  }
}

// Save the cart array back to localStorage.
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Add a product to the cart. If it's already in there, increase its quantity
// instead of adding a duplicate line.
function addItemToCart({ id, name, price, image, qty }) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, image, qty });
  }

  saveCart(cart);
}

// Total number of units in the cart (used for the header badge).
function getCartItemCount() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

// Update the little badge on the cart icon, if this page has one.
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = getCartItemCount();
  }
}
