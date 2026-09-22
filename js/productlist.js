const endpoint = "https://kea-alt-del.dk/t7/api/products?limit=20";
const produktliste = document.querySelector(".produktliste");

fetch(endpoint)
  .then((response) => response.json())
  .then(visProdukter)
  .catch(visFejl);

function visProdukter(produkter) {
  produktliste.innerHTML = produkter.map(lavProduktKort).join("");
}

function lavProduktKort(produkt) {
  const billede = `https://kea-alt-del.dk/t7/images/webp/640/${produkt.id}.webp`;
  const rabatPris = Math.round(produkt.price - (produkt.price * produkt.discount) / 100);
  const pris = produkt.discount
    ? `<p class="price"><span class="old-price">${produkt.price} kr.</span> ${rabatPris} kr.</p>`
    : `<p class="price">${produkt.price} kr.</p>`;
  const udsolgtClass = produkt.soldout ? " sold-out" : "";
  const udsolgtTekst = produkt.soldout ? `<p class="status">Udsolgt</p>` : "";

  return `
    <article class="product-card${udsolgtClass}">
      <a href="productdetails.html?id=${produkt.id}">
        <img src="${billede}" alt="${produkt.productdisplayname}" />
        <div class="product-info">
          <p class="brand">${produkt.brandname}</p>
          <h2>${produkt.productdisplayname}</h2>
          <p class="category">${produkt.articletype} / ${produkt.subcategory}</p>
          ${pris}
          ${udsolgtTekst}
        </div>
      </a>
    </article>
  `;
}

function visFejl() {
  produktliste.innerHTML = "<p>Produkterne kunne ikke hentes lige nu.</p>";
}
