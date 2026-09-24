// Gemmer API-adressen, hvor produktdata bliver hentet fra.
const endpoint = "https://kea-alt-del.dk/t7/api/products?limit=20";

// Finder HTML-elementet med classen "produktliste", hvor produkterne skal vises.
const produktliste = document.querySelector(".produktliste");

// Henter produktdata fra API'et.
fetch(endpoint)
  // Laver svaret fra API'et om til JavaScript-data.
  .then((response) => response.json())
  // Sender produktlisten videre til funktionen, der viser produkterne på siden.
  .then(visProdukter)
  // Kører fejl-funktionen, hvis produkterne ikke kan hentes.
  .catch(visFejl);

// Funktionen modtager alle produkter fra API'et.
function visProdukter(produkter) {
  // Laver hvert produkt om til HTML og sætter det ind i produktliste-sectionen.
  produktliste.innerHTML = produkter.map(lavProduktKort).join("");
}
// Funktionen laver HTML-koden for et enkelt produkt.
function lavProduktKort(produkt) {
  // Bygger billedets URL ud fra produktets id.
  const billede = `https://kea-alt-del.dk/t7/images/webp/640/${produkt.id}.webp`;

  // Regner rabatprisen ud, hvis produktet har rabat.
  const rabatPris = Math.round(produkt.price - (produkt.price * produkt.discount) / 100);

  // Vælger om prisen skal vises med rabatpris eller kun normal pris.
  const pris = produkt.discount
    ? // Hvis produktet har rabat, vises både gammel pris og rabatpris.
      `<p class="price"><span class="old-price">${produkt.price} kr.</span> ${rabatPris} kr.</p>`
    : // Hvis produktet ikke har rabat, vises kun normal pris.
      `<p class="price">${produkt.price} kr.</p>`;

  // Tilføjer classen "sold-out", hvis produktet er udsolgt.
  const udsolgtClass = produkt.soldout ? " sold-out" : "";

  // Laver en udsolgt-tekst, hvis produktet er udsolgt.
  const udsolgtTekst = produkt.soldout ? `<p class="status">Udsolgt</p>` : "";

  // Returnerer HTML-strukturen for produktkortet.
  return `
    <article class="product-card${udsolgtClass}">
      <a href="productdetails.html?id=${produkt.id}">
        <img class="product-image-${produkt.id}" src="${billede}" alt="${produkt.productdisplayname}" />
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

// Funktionen vises, hvis der sker en fejl med at hente produkterne.
function visFejl() {
  // Skriver en fejlbesked i produktlisten.
  produktliste.innerHTML = "<p>Produkterne kunne ikke hentes lige nu.</p>";
}
