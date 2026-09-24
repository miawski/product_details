const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const endpoint = `https://kea-alt-del.dk/t7/api/products/${id}`;
const product = document.querySelector("#product");
const backbutton = document.querySelector("#backbutton");

backbutton.addEventListener("click", () => history.back());

if (id) {
  fetch(endpoint)
    .then((response) => response.json())
    .then(visProdukt)
    .catch(visFejl);
} else {
  visFejl();
}

function visProdukt(produkt) {
  const billede = `https://kea-alt-del.dk/t7/images/webp/640/${produkt.id}.webp`;
  const harRabat = produkt.discount > 0;
  const rabatPris = Math.round(produkt.price - (produkt.price * produkt.discount) / 100);
  const pris = harRabat ? `<p class="price"><span class="old-price">${produkt.price} kr.</span> ${rabatPris} kr.</p>` : `<p class="price">${produkt.price} kr.</p>`;
  const udsolgtTekst = produkt.soldout ? `<p class="status">Udsolgt</p>` : "";
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
    .filter((detalje) => detalje[1])
    .map((detalje) => `<dt>${detalje[0]}</dt><dd>${detalje[1]}</dd>`)
    .join("");

  product.innerHTML = `
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

function visFejl() {
  product.innerHTML = `
    <h1>Produktet blev ikke fundet</h1>
  `;
}

/*
Forklaring:

URLSearchParams(window.location.search) læser query string fra URL'en.

params.get("id") henter produktets id fra URL'en, fx 1163 fra productdetails.html?id=1163.

endpoint gemmer API-adressen til det specifikke produkt.

product finder HTML-elementet, hvor produktdetaljerne skal vises.

backbutton finder tilbage-knappen i HTML.

backbutton.addEventListener("click", () => history.back()) sender brugeren tilbage til den side, de kom fra.

if (id) tjekker om der faktisk findes et produkt-id i URL'en.

fetch(endpoint) henter data for ét bestemt produkt.

.then((response) => response.json()) laver API-svaret om til JavaScript-data.

.then(visProdukt) sender produkt-objektet videre til funktionen visProdukt.

.catch(visFejl) viser fejlbeskeden, hvis produktet ikke kan hentes.

else visFejl() kører, hvis URL'en mangler et id.

visProdukt(produkt) modtager ét produkt som parameter.

billede bygger produktets billed-URL ud fra produkt.id.

harRabat gemmer true eller false alt efter om produkt.discount er større end 0.

rabatPris regner produktets pris efter rabat.

pris vælger HTML for normal pris eller rabatpris.

udsolgtTekst laver teksten "Udsolgt", hvis produktet er udsolgt.

detaljer er et array med de produktoplysninger, der skal vises i detail-listen.

.filter((detalje) => detalje[1]) fjerner oplysninger uden værdi.

.map((detalje) => ...) laver hver oplysning om til dt/dd HTML.

.join("") samler alle detail-linjerne til én HTML-tekst.

product.innerHTML indsætter hele produktvisningen på siden.

visFejl() indsætter en tilbage-link og en fejlbesked, hvis produktet ikke findes.
*/
