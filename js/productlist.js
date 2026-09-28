const cat = new URLSearchParams(window.location.search).get("cat");
const categoryTitle = document.querySelector("#category-title");
const endpoint = cat ? `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(cat)}` : "https://kea-alt-del.dk/t7/api/products?limit=20";
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
  productList.innerHTML = "";
  console.log(products);
  products.forEach((product) => {
    productList.innerHTML += createProductCard(product);
  });
}

function createProductCard(product) {
  const image = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
  const hasDiscount = Number(product.discount) > 0;
  const discountPercentage = Math.round(Number(product.discount));
  const isSoldOut = Boolean(product.soldout);
  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
  const price = hasDiscount ? `<p class="price"><span class="old-price">${product.price} DKK</span> ${discountedPrice} DKK</p>` : `<p class="price">${product.price} DKK</p>`;
  const discountLabel = product.discount ? `<p class="tilbudlabel">-${discountPercentage}%</p>` : "";
  const offerText = hasDiscount ? `<p class="status offer-status">Sale</p>` : "";
  const soldOutText = isSoldOut ? `<p class="status">Sold out</p>` : "";

  return `
    <article class="card ${product.soldout ? "udsolgt" : ""} product-card">
      <a href="productdetails.html?id=${product.id}">
        ${discountLabel}
        <img class="product-image-${product.id}" src="${image}" alt="${product.productdisplayname}" />
        <div class="product-info">
          <h2>${product.productdisplayname}</h2>
          <h3 class="brand">${product.brandname}</h3>
          <p class="category">${product.subcategory}</p>
          ${offerText}
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

console.log(products) prints the received product data in the browser console, as in the teacher's example.

products.forEach() runs createProductCard once for each product.

productList.innerHTML += adds each generated product card to the product list.

createProductCard(product) receives one product at a time as a parameter.

image builds the product image URL from product.id.

hasDiscount is true only when the API discount value is greater than zero.

isSoldOut converts the API soldout value to a true/false value.

discountedPrice calculates the reduced price using the API discount percentage.

discountPercentage rounds the API discount to a whole percentage for the visual label.

discountLabel follows the teacher's conditional template pattern and creates a percentage tilbudlabel only when product.discount is truthy.

price selects regular or discounted price markup based on hasDiscount.

offerText displays "Sale" only when hasDiscount is true.

The article class uses the teacher's direct conditional pattern: product.soldout ? "udsolgt" : "". A true value adds the udsolgt CSS class to the product card; false leaves that class empty. The card and product-card classes preserve the site's existing card styling.

soldOutText displays "Sold out" only when isSoldOut is true.

return sends the product card HTML back to the forEach() callback, where it is added to productList.

The link uses productdetails.html?id=${product.id}, so the details page knows which product to display.

showError() displays an error message in the product list if the API request fails.

In the returned card, offerText, price, and soldOutText are inserted in the product information area. The offer and sold-out conditions are independent, so both messages can appear when both API values apply.

discountLabel is inserted inside the product link before the image so CSS can position the tilbudlabel over the image area.
*/
