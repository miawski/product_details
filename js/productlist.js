const cat = new URLSearchParams(window.location.search).get("cat");
const categoryTitle = document.querySelector("#category-title");
const endpoint = cat
  ? `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(cat)}`
  : "https://kea-alt-del.dk/t7/api/products?limit=20";
const productList = document.querySelector(".product-list");

if (cat) {
  categoryTitle.textContent = cat;
} else {
  categoryTitle.hidden = true;
}

fetch(endpoint)
  .then((response) => response.json())
  .then(renderProducts)
  .catch(showError);

function renderProducts(products) {
  productList.innerHTML = products.map(createProductCard).join("");
}

function createProductCard(product) {
  const image = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
  const price = product.discount ? `<p class="price"><span class="old-price">${product.price} DKK</span> ${discountedPrice} DKK</p>` : `<p class="price">${product.price} DKK</p>`;
  const soldOutClass = product.soldout ? " sold-out" : "";
  const soldOutText = product.soldout ? `<p class="status">Sold out</p>` : "";

  return `
    <article class="product-card${soldOutClass}">
      <a href="productdetails.html?id=${product.id}">
        <img class="product-image-${product.id}" src="${image}" alt="${product.productdisplayname}" />
        <div class="product-info">
          <p class="brand">${product.brandname}</p>
          <h2>${product.productdisplayname}</h2>
          <p class="category">${product.articletype} / ${product.subcategory}</p>
          ${price}
          ${soldOutText}
        </div>
      </a>
    </article>
  `;
}

function showError() {
  productList.innerHTML = "<p>Products could not be loaded right now.</p>";
}

/*
Explanation:

cat reads the selected category from the page's URL parameter.

categoryTitle selects the heading where the selected category is displayed.

endpoint uses the category API when a category is selected, and the default list otherwise.

productList selects the HTML element where product cards are inserted.

categoryTitle.textContent displays the category name on the product list page.

categoryTitle.hidden hides the category heading when the page opens without a selected category.

fetch(endpoint) requests the products from the API.

.then((response) => response.json()) converts the API response into JavaScript data.

.then(renderProducts) passes the product array to renderProducts.

.catch(showError) runs showError if the data cannot be loaded.

renderProducts(products) receives the product array.

products.map(createProductCard) runs createProductCard once for each product.

.join("") combines all product cards into one HTML string.

createProductCard(product) receives one product at a time as a parameter.

image builds the product image URL from product.id.

discountedPrice calculates the reduced price when a product has a discount.

price selects the HTML for the regular or discounted price.

soldOutClass adds the sold-out CSS class when the product is sold out.

soldOutText displays "Sold out" when the product is sold out.

return sends the product card HTML back to map().

The link uses productdetails.html?id=${product.id}, so the details page knows which product to display.

showError() displays an error message in the product list if the API request fails.
*/
