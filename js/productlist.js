const cat = new URLSearchParams(window.location.search).get("cat");
const categoryTitle = document.querySelector("#category-title");
const endpoint = cat
  ? `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(cat)}`
  : "https://kea-alt-del.dk/t7/api/products";
const productList = document.querySelector(".product-list");
const genderButtons = document.querySelectorAll("#filtre button");
const productCount = document.querySelector("#product-count");
let allData;
let udsnit;

if (cat) {
  categoryTitle.textContent = cat;
} else {
  categoryTitle.hidden = true;
}

genderButtons.forEach((button) => {
  button.addEventListener("click", filtrer);
});

fetch(endpoint)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Products could not be loaded.");
    }

    return res.json();
  })
  .then((data) => {
    allData = udsnit = data;
    renderProducts(data);
  })
  .catch(showError);

function filtrer(e) {
  const selectedGender = e.target.textContent.trim(); // Read the clicked filter button.
  console.log(e.target.textContent);
  if (selectedGender === "All") {
    udsnit = allData;
  } else {
    udsnit = allData.filter((product) => getProductGender(product) === selectedGender);
  }

  genderButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button === e.currentTarget ? "true" : "false");
  });

  renderProducts(udsnit);
}

function renderProducts(products) {
  productList.innerHTML = "";
  console.log(products);
  productCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"} found`;
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
  const isSoldOut = Boolean(product.soldout);
  const tilbudspris = Math.round(product.price - (product.price * product.discount) / 100);
  const discountContent = hasDiscount
    ? `
        <p class="tilbudlabel">-${discountPercentage}%</p>
        <p class="status offer-status">Sale</p>
        <p class="price"><span class="old-price">Before ${product.price} DKK</span> <span class="tilbudspris">Now ${tilbudspris} DKK</span></p>
      `
    : `<p class="price">${product.price} DKK</p>`;
  const soldOutText = isSoldOut ? `<p class="status">Sold out</p>` : "";

  return `
    <article class="card product-card">
      <a class="${product.soldout ? "udsolgt" : ""}" href="productdetails.html?id=${product.id}">
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

/*
Explanation:

cat reads the selected category from the URL parameter. When a category is present, the API request stays scoped to that category.

endpoint requests products from the selected category or from the full product catalogue.

categoryTitle shows the selected category, and stays hidden when the list is not category-specific.

genderButtons selects the four filter buttons in productlist.html. Each button gets a click event listener before the products are fetched.

allData stores the full product array from the API; udsnit stores the currently selected subset. The fetch callback assigns the response to both, like the teacher's alleData = udsnit = data.

The fetch response check throws an error for an unsuccessful HTTP response. res.json() converts a successful response into JavaScript data. The next callback stores the data in both allData and udsnit, then renders the initial list, matching the teacher's allData = udsnit = data flow.

filtrer(e) runs when a gender button is clicked. e.target.textContent reads the clicked label. All restores allData; the other buttons filter allData by gender into udsnit. The console logs show the clicked label and current subset for debugging.

The aria-pressed loop marks the active filter for assistive technology and for the button's visual selected state.

renderProducts(products) logs the products being displayed, clears the current product list, updates productCount to match the visible results, then creates one card per product with createProductCard(product). This is the equivalent of the teacher's console.log(json) inside visData(json).

createProductCard(product) receives one product object and returns its HTML card.

image builds the product image URL. hasDiscount, tilbudspris, and discountPercentage prepare the sale price and discount label.

discountContent uses a conditional expression to group the percentage label, Sale status, original Before price, and calculated Now price. Products without a discount show only their regular price.

The product link class uses the teacher's conditional pattern: product.soldout ? "udsolgt" : "". A sold-out link receives the udsolgt class; otherwise the class is empty.

soldOutText displays "Sold out" when the API marks the product as sold out. Sale and sold-out status are independent conditions.

showError() displays a message if the API request fails.

The existing category query and product-card rendering are preserved; the gender filter narrows the fetched category list when one is selected.

The product API labels product 1165 as Men, but this product should be treated as Women in this project. getProductGender() applies that single confirmed correction to the gender filter.

The products endpoint no longer sets limit=30, so gender filters can search all products returned for the selected category or catalogue.

productCount is the live result counter in productlist.html. renderProducts updates it every time the list is drawn, including after each gender filter is selected.

genderButtons selects the teacher's filter controls with #filtre button. createProductCard displays the corrected product gender, not the subcategory.

For discounted products, tilbudspris is Math.round(price - (price * discount / 100)). The discountContent conditional displays the original amount as Before and the calculated amount as Now. Products without a discount show one regular price.
*/
