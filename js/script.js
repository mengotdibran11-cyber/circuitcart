/* ==========================================================================
   CircuitCart — script.js
   Two jobs:
   1. Render star ratings from each card's data-rating attribute.
   2. Add-to-cart: save items to the shared cart (see cart-storage.js) and
      keep the header badge in sync, including on page load, so the badge
      still shows the right count if you left items in the cart earlier.
      The cart icon itself is a plain link to cart.html (a real sub-page,
      same tab) — see index.html.
   ========================================================================== */

/* ---------- 1. Render star ratings ---------- */

function renderStars() {
  const starContainers = document.querySelectorAll(".stars");

  starContainers.forEach((container) => {
    const rating = Number(container.dataset.rating);

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.classList.add("star");
      star.textContent = "★";

      if (i <= rating) {
        star.classList.add("filled");
      }

      container.appendChild(star);
    }
  });
}

/* ---------- 2. Add to cart ---------- */

let toastTimer = null;

function showCartToast(quantity) {
  const toast = document.getElementById("cartToast");
  const message = document.getElementById("cartToastMessage");
  if (!toast || !message) return;

  const label = quantity === 1 ? "1 item" : `${quantity} items`;
  message.textContent = `Added! You have added ${label} to your cart`;

  toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2500);
}

function hideCartToast() {
  const toast = document.getElementById("cartToast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.classList.remove("is-visible");
}

function setUpCartToastDismiss() {
  const dismissBtn = document.getElementById("cartToastDismiss");
  if (!dismissBtn) return;
  dismissBtn.addEventListener("click", hideCartToast);
}

function setUpAddToCartButtons() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const button = card.querySelector(".btn--add-to-cart");
    const qtySelect = card.querySelector(".qty-select");
    const image = card.querySelector(".product-card__img");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    button.addEventListener("click", () => {
      const quantity = Number(qtySelect.value);

      addItemToCart({
        id: slugify(name),
        name: name,
        price: price,
        image: image.getAttribute("src"),
        qty: quantity,
      });

      updateCartBadge();
      showCartToast(quantity);
    });
  });
}

/* ---------- Run everything once the page has loaded ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderStars();
  setUpAddToCartButtons();
  setUpCartToastDismiss();
  updateCartBadge(); // reflect any items already in the cart from before
});
