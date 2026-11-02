
function getCart() {
  return JSON.parse(localStorage.getItem("threadsCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("threadsCart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const element = document.getElementById("cart-count");

  if (element) {
    element.textContent = count;
  }
}

function addToCart(name, price) {
  const cart = getCart();
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();

  const message = document.getElementById("message");
  if (message) {
    message.textContent = name + " added to your cart!";
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function renderCartPage() {
  const container = document.getElementById("cart-items");

  // Run only on the cart page
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500">Your cart is empty. Visit our shop to find your style!</p>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex justify-between items-center gap-4 border-b pb-5">
        <div>
          <h3 class="font-bold">${item.name}</h3>
          <p class="text-gray-500 mt-2">₹${item.price} each</p>
          <div class="flex gap-3 mt-3 items-center">
            <button data-decrease="${item.name}"
              class="border px-3 py-1">−</button>
            <span>${item.quantity}</span>
            <button data-increase="${item.name}"
              class="border px-3 py-1">+</button>
            <button data-remove="${item.name}"
              class="text-red-600 ml-2">Remove</button>
          </div>
        </div>
        <p class="font-bold">₹${item.price * item.quantity}</p>
      </div>
    `).join("");
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-total").textContent =
    "₹" + total.toLocaleString("en-IN");

  updateCartCount();
}

document.addEventListener("click", function(event) {
  const decrease = event.target.closest("[data-decrease]");
  const increase = event.target.closest("[data-increase]");
  const remove = event.target.closest("[data-remove]");

  if (!decrease && !increase && !remove) return;

  const name = (decrease || increase || remove).dataset[
    decrease ? "decrease" : increase ? "increase" : "remove"
  ];

  let cart = getCart();
  const item = cart.find(product => product.name === name);

  if (!item) return;

  if (decrease) item.quantity--;
  if (increase) item.quantity++;
  if (remove || item.quantity <= 0) {
    cart = cart.filter(product => product.name !== name);
  }

  saveCart(cart);
  renderCartPage();
});

document.addEventListener("DOMContentLoaded", function() {
  renderCartPage();

  const checkout = document.getElementById("checkout-btn");

  if (checkout) {
    checkout.addEventListener("click", function() {
      const cart = getCart();
      const message = document.getElementById("cart-message");

      message.textContent = cart.length
        ? "Demo website: payment is not connected yet."
        : "Your cart is empty!";
    });
  }
});
