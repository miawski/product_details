// Finder id'et fra URL'en, fx productdetails.html?id=1163.
const params = new URLSearchParams(window.location.search);

// Gemmer produktets id fra URL'en.
const id = params.get("id");

// Finder main-elementet, hvor produktdetaljerne skal vises.
const main = document.querySelector(".details-page");

// Tjekker om der findes et id i URL'en.
if (id) {
  // Henter data om det enkelte produkt fra API'et.
  fetch(`https://kea-alt-del.dk/t7/api/products/${id}`)
    // Laver svaret fra API'et om til JavaScript-data.
    .then((response) => response.json())
    // Sender produktet videre til funktionen, der viser produktdetaljerne.
    .then(visProdukt)
    // Viser en fejlbesked, hvis produktet ikke kan hentes.
    .catch(visFejl);
} else {
  // Viser en fejlbesked, hvis URL'en ikke indeholder et produkt-id.
  visFejl();
}

// Funktionen viser alle relevante detaljer om produktet på siden.
function visProdukt(produkt) {
  // Bygger billedets URL ud fra produktets id.
  const billede = `https://kea-alt-del.dk/t7/images/webp/640/${produkt.id}.webp`;

  // Tjekker om produktet har rabat.
  const harRabat = produkt.discount > 0;

  // Regner rabatprisen ud, hvis produktet har rabat.
  const rabatPris = Math.round(produkt.price - (produkt.price * produkt.discount) / 100);

  // Vælger om prisen skal vises med rabatpris eller kun normal pris.
  const pris = harRabat ? `<p class="price"><span class="old-price">${produkt.price} kr.</span> ${rabatPris} kr.</p>` : `<p class="price">${produkt.price} kr.</p>`;

  // Laver en tekst, hvis produktet er udsolgt.
  const udsolgtTekst = produkt.soldout ? `<p class="status">Udsolgt</p>` : "";

  // Samler produktets ekstra informationer i en liste.
  const detaljer = [
    ["Mærke", produkt.brandname],
    ["Kategori", produkt.category],
    ["Underkategori", produkt.subcategory],
    ["Type", produkt.articletype],
    ["Køn", produkt.gender],
    ["Sæson", produkt.season],
    ["År", produkt.productionyear],
    ["Brug", produkt.usagetype],
  ]
    // Fjerner tomme værdier, så siden kun viser data, som findes.
    .filter((detalje) => detalje[1])
    // Laver hver detalje om til HTML.
    .map((detalje) => `<dt>${detalje[0]}</dt><dd>${detalje[1]}</dd>`)
    // Samler alle HTML-linjer til én samlet tekst.
    .join("");

  // Sætter produktdetaljerne ind på siden.
  main.innerHTML = `
    <a class="back-link" href="productlist.html">Tilbage til produktlisten</a>
    <section class="product-detail">
      <img class="detail-image product-image-${produkt.id}" src="${billede}" alt="${produkt.productdisplayname}" />
      <div class="detail-info">
        <p class="brand">${produkt.brandname}</p>
        <h1>${produkt.productdisplayname}</h1>
        ${pris}
        ${udsolgtTekst}
        <dl class="detail-list">
          ${detaljer}
        </dl>
      </div>
    </section>
  `;
}

// Funktionen vises, hvis produktdetaljerne ikke kan hentes.
function visFejl() {
  // Skriver en fejlbesked på details-siden.
  main.innerHTML = `
    <a class="back-link" href="productlist.html">Tilbage til produktlisten</a>
    <h1>Produktet blev ikke fundet</h1>
  `;
}
