const cat = new URLSearchParams(window.location.search).get("cat");
const categoryTitle = document.querySelector("#category-title");
const endpoint = cat ? `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(cat)}` : "https://kea-alt-del.dk/t7/api/products";
const productList = document.querySelector(".product-list");
const genderButtons = document.querySelectorAll("#filters button");
const sortButtons = document.querySelectorAll("#sorting button");
const visibleCount = document.querySelector("#product-count");
let allData;
let visibleProducts;

if (cat) {
  categoryTitle.textContent = cat;
} else {
  categoryTitle.hidden = true;
}

genderButtons.forEach((button) => {
  button.addEventListener("click", filterProducts);
});

sortButtons.forEach((button) => {
  button.addEventListener("click", sortProducts);
});

fetch(endpoint)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Products could not be loaded.");
    }

    return res.json();
  })
  .then((data) => {
    allData = visibleProducts = data;
    renderProducts(visibleProducts);
  })
  .catch(showError);

function filterProducts(e) {
  const selectedGender = e.target.textContent.trim(); // Read the label of the clicked filter button.
  console.log(e.target.textContent);
  if (selectedGender === "All") {
    visibleProducts = allData;
  } else {
    visibleProducts = allData.filter((product) => getProductGender(product) === selectedGender);
  }
  console.log(allData, visibleProducts);

  genderButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button === e.currentTarget ? "true" : "false");
  });

  renderProducts(visibleProducts);
}

function sortProducts(e) {
  if (!Array.isArray(visibleProducts)) return;

  const choice = e.currentTarget.textContent.trim();

  if (choice === "Price: low to high") {
    visibleProducts = [...visibleProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (choice === "Price: high to low") {
    visibleProducts = [...visibleProducts].sort((a, b) => Number(b.price) - Number(a.price));
  } else if (choice === "A-Z") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.productdisplayname.localeCompare(b.productdisplayname, "en"));
  } else if (choice === "Z-A") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.productdisplayname.localeCompare(a.productdisplayname, "en"));
  }

  renderProducts(visibleProducts);
}

function renderProducts(products) {
  productList.innerHTML = "";
  visibleCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"} found`;
  products.forEach((product) => {
    productList.innerHTML += createProductCard(product);
  });
}

function getProductGender(product) {
  return Number(product.id) === 1165 ? "Women" : product.gender;
}

function createProductCard(product) {
  const image = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
  const hasDiscount = Number(product.discount) > 0;
  const discountPercentage = Math.round(Number(product.discount));
  const isSoldOut = Number(product.soldout) > 0;
  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
  const discountContent = hasDiscount
    ? `
        <p class="discount-label">-${discountPercentage}%</p>
        <p class="status offer-status">Sale</p>
        <p class="price"><span class="old-price">Before ${product.price} DKK</span> <span class="discount-price">Now ${discountedPrice} DKK</span></p>
      `
    : `<p class="price">${product.price} DKK</p>`;
  const soldOutText = isSoldOut ? `<p class="status">Sold out</p>` : "";

  return `
    <article class="card product-card">
      <a class="${isSoldOut ? "sold-out" : ""}" href="productdetails.html?id=${product.id}">
        <img class="product-image-${product.id}" src="${image}" alt="${product.productdisplayname}" />
        <div class="product-info">
          <h2>${product.productdisplayname}</h2>
          <h3 class="brand">${product.brandname}</h3>
          ${discountContent}
          <p class="category">${getProductGender(product)}</p>
          ${soldOutText}
        </div>
      </a>
    </article>
  `;
}

function showError() {
  productList.innerHTML = "<p>Products could not be loaded right now.</p>";
}
