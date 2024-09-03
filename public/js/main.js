// Header Scroll
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});
// Products Array
const products = [
  {
    id: 1,
    title: "Shadow BoneZ ",
    price: 150,
    image:
      "https://pbs.twimg.com/media/FH5s-B5XEAIdqTd.jpg",
  },
  {
    id: 2,
    title: "DeZert Storm ",
    price: 150,
    image:
      "https://i.pinimg.com/736x/a3/c4/76/a3c4766159a66438286df86476691ae8.jpg",
  },
  {
    id: 3,
    title: "Hot Pink SunZet",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/FullSizeRender_4976bb91-b2c5-4bb5-96ac-2cd74e36a6c2.jpg?v=1696410712",
  },
  {
    id: 4,
    title: "Smoking GhoZt Parka ",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/9523276F-5F47-490B-9632-61B6A45FA9D1.jpg?v=1711778508",
  },
  {
    id: 5,
    title: "Zmoke N Flare ",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/07B2DF13-DDD6-4C14-A8A6-DF3335CD5639.jpg?v=1703057360",
  },
  {
    id: 6,
    title: "Desert EclipseZ Flare ",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/FAB560E4-B5BB-4B50-A895-E7CD879596A2.jpg?v=1721557783",
  },
  {
    id: 7,
    title: "WoodlandZ Maine",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/99F8CD43-6A7D-496E-AA4C-17F0989A12F8.jpg?v=1721560613",
  },
  {
    id: 8,
    title: "Oceanic BoneZ",
    price: 150,
    image:
      "https://songsamnoung.com/cdn/shop/files/0C77258F-1F2F-49D9-9497-3A4AD65E956C.jpg?v=1721560335",
  },
];

// Get the products list and elements
const productList = document.getElementById("productList");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

// Store Cart Items In Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products On Page
function renderProducts() {
  productList.innerHTML = products
    .map(
      (product) => `
    <div class="product">
    <img src="${product.image}" alt="${product.title}" class="product-img" />
    <div class="product-info">
      <h2 class="product-title">${product.title}</h2>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <a class="add-to-cart" data-id="${product.id}">Add to cart</a>
    </div>
  </div>
    `
    )
    .join("");
  // Add to cart
  const addToCartButtons = document.getElementsByClassName("add-to-cart");
  for (let i = 0; i < addToCartButtons.length; i++) {
    const addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", addToCart);
  }
}

// Add to cart
function addToCart(event) {
  const productID = parseInt(event.target.dataset.id);
  const product = products.find((product) => product.id === productID);

  if (product) {
    // If product already in cart
    const exixtingItem = cart.find((item) => item.id === productID);

    if (exixtingItem) {
      exixtingItem.quantity++;
    } else {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      cart.push(cartItem);
    }
    // Change Add to cart text to added
    event.target.textContent = "Added";
    updateCartIcon();
    saveToLocalStorage();
    renderCartItems();
    calculateCartTotlal();
  }
}

// Remove from cart
function removeFromCart(event) {
  const productID = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productID);
  saveToLocalStorage();
  renderCartItems();
  calculateCartTotlal();
  updateCartIcon();
}
// Quantity Change
function changeQuantity(event) {
  const productID = parseInt(event.target.dataset.id);
  const quantity = parseInt(event.target.value);

  if (quantity > 0) {
    const cartItem = cart.find((item) => item.id === productID);
    if (cartItem) {
      cartItem.quantity = quantity;
      saveToLocalStorage();
      calculateCartTotlal();
      updateCartIcon();
    }
  }
}
// SaveToLocalStorage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Prodcuts On Cart Page
function renderCartItems() {
  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
    <img src="${item.image}" alt="${item.title}" />
    <div class="cart-item-info">
      <h2 class="cart-item-title">${item.title}</h2>
      <input
        class="cart-item-quantity"
        type="number"
        name=""
        min="1"
        value="${item.quantity}"
        data-id="${item.id}"
      />
    </div>
    <h2 class="cart-item-price">$${item.price}</h2>
    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
  </div>
    `
    )
    .join("");
  // Remove From Cart
  const removeButtons = document.getElementsByClassName("remove-from-cart");
  for (let i = 0; i < removeButtons.length; i++) {
    const removeButton = removeButtons[i];
    removeButton.addEventListener("click", removeFromCart);
  }
  // Quantity Change
  const quantityInputs = document.querySelectorAll(".cart-item-quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", changeQuantity);
  });
}

// Claculate Total
function calculateCartTotlal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Check If On Cart Page
if (window.location.pathname.includes("cart.html")) {
  renderCartItems();
  calculateCartTotlal();
} else if (window.location.pathname.includes("success.html")) {
  clearCart();
} else {
  renderProducts();
}
// Empty Cart on successfull payment
function clearCart() {
  cart = [];
  saveToLocalStorage();
  updateCartIcon;
}
// Cart Icon Quantity
const cartIcon = document.getElementById("cart-icon");

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + iyem.quantity, 0);
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

updateCartIcon();

function updateCartIconOnCartChange() {
  updateCartIcon();
}

window.addEventListener("storage", updateCartIconOnCartChange);

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon");
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

renderProducts();
renderCartItems();
calculateCartTotlal();
