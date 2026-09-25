const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const endpoint = `https://kea-alt-del.dk/t7/api/products/${id}`;
const product = document.querySelector("#product");
const backbutton = document.querySelector("#backbutton");

backbutton.addEventListener("click", () => history.back());

if (id) {
  fetch(endpoint)
    .then((response) => response.json())
    .then(renderProduct)
    .catch(showError);
} else {
  showError();
}

function renderProduct(productData) {
  const image = `https://kea-alt-del.dk/t7/images/webp/640/${productData.id}.webp`;
  const hasDiscount = productData.discount > 0;
  const discountedPrice = Math.round(productData.price - (productData.price * productData.discount) / 100);
  const price = hasDiscount ? `<p class="price"><span class="old-price">${productData.price} DKK</span> ${discountedPrice} DKK</p>` : `<p class="price">${productData.price} DKK</p>`;
  const soldOutText = productData.soldout ? `<p class="status">Sold out</p>` : "";
  const details = [
    ["Brand", productData.brandname],
    ["Category", productData.category],
    ["Subcategory", productData.subcategory],
    ["Type", productData.articletype],
    ["Gender", productData.gender],
    ["Season", productData.season],
    ["Year", productData.productionyear],
    ["Usage", productData.usagetype],
  ]
    .filter((detail) => detail[1])
    .map((detail) => `<dt>${detail[0]}</dt><dd>${detail[1]}</dd>`)
    .join("");

  product.innerHTML = `
    <section class="product-detail">
      <img class="detail-image product-image-${productData.id}" src="${image}" alt="${productData.productdisplayname}" />
      <div class="detail-info">
        <p class="brand">${productData.brandname}</p>
        <h1>${productData.productdisplayname}</h1>
        ${price}
        ${soldOutText}
        <dl class="detail-list">
          ${details}
        </dl>
      </div>
    </section>
  `;
}

function showError() {
  product.innerHTML = `
    <h1>Product not found</h1>
  `;
}

/*
Explanation:

URLSearchParams(window.location.search) reads the query string from the URL.

params.get("id") reads the product ID from the URL, for example 1163 from productdetails.html?id=1163.

endpoint stores the API address for the selected product.

product selects the HTML element where the product details will appear.

backbutton selects the back button in the HTML.

backbutton.addEventListener("click", () => history.back()) returns the user to the previous page.

if (id) checks whether the URL contains a product ID.

fetch(endpoint) requests data for one specific product.

.then((response) => response.json()) converts the API response into JavaScript data.

.then(renderProduct) passes the product object to renderProduct.

.catch(showError) displays an error message if the product cannot be loaded.

else showError() runs if the URL does not contain an ID.

renderProduct(productData) receives one product as a parameter.

image builds the product image URL from productData.id.

hasDiscount stores true or false depending on whether productData.discount is greater than 0.

discountedPrice calculates the product price after the discount.

price selects the HTML for the regular or discounted price.

soldOutText displays "Sold out" when the product is sold out.

details is an array containing the product information to display in the details list.

.filter((detail) => detail[1]) removes details that do not have a value.

.map((detail) => ...) converts each detail into dt/dd HTML.

.join("") combines all detail rows into one HTML string.

product.innerHTML inserts the complete product view into the page.

showError() displays an error message if the product cannot be found.
*/
