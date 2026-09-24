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
  const pris = produkt.discount ? `<p class="price"><span class="old-price">${produkt.price} kr.</span> ${rabatPris} kr.</p>` : `<p class="price">${produkt.price} kr.</p>`;
  const udsolgtClass = produkt.soldout ? " sold-out" : "";
  const udsolgtTekst = produkt.soldout ? `<p class="status">Udsolgt</p>` : "";

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

function visFejl() {
  produktliste.innerHTML = "<p>Produkterne kunne ikke hentes lige nu.</p>";
}

/*
Forklaring:

const endpoint gemmer API-adressen til produktlisten.

const produktliste finder HTML-elementet, hvor produktkortene skal sættes ind.

fetch(endpoint) henter produkterne fra API'et.

.then((response) => response.json()) laver API-svaret om til JavaScript-data.

.then(visProdukter) sender produkt-arrayet videre til funktionen visProdukter.

.catch(visFejl) kører visFejl, hvis data ikke kan hentes.

visProdukter(produkter) modtager arrayet med produkter.

produkter.map(lavProduktKort) kører lavProduktKort én gang for hvert produkt.

.join("") samler alle produktkort til én samlet HTML-tekst.

lavProduktKort(produkt) modtager ét produkt ad gangen som parameter.

billede bygger produktets billed-URL ud fra produkt.id.

rabatPris regner den nye pris ud, hvis produktet har rabat.

pris vælger HTML for normal pris eller rabatpris.

udsolgtClass tilføjer CSS-classen sold-out, hvis produktet er udsolgt.

udsolgtTekst laver teksten "Udsolgt", hvis produktet er udsolgt.

return sender HTML-strukturen for produktkortet tilbage til map().

Linket bruger productdetails.html?id=${produkt.id}, så detaljesiden ved hvilket produkt der skal vises.

visFejl() viser en fejlbesked i produktlisten, hvis API'et fejler.
*/
