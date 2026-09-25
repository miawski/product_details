const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const catListeContainer = document.querySelector("#catListeContainer");

fetch(endpoint)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Kategorierne kunne ikke hentes.");
    }

    return response.json();
  })
  .then(visKategorier)
  .catch(visFejl);

function visKategorier(kategorier) {
  catListeContainer.replaceChildren();

  kategorier.forEach((element) => {
    const kategoriLink = document.createElement("a");
    const parametre = new URLSearchParams({ cat: element.category });

    kategoriLink.href = `productlist.html?${parametre.toString()}`;
    kategoriLink.textContent = element.category;
    catListeContainer.appendChild(kategoriLink);
  });
}

function visFejl() {
  catListeContainer.textContent = "Kategorierne kunne ikke hentes lige nu.";
}

/*
Forklaring:

endpoint gemmer adressen til KEA's API med kategorier.

catListeContainer finder det tomme HTML-element, hvor kategorierne skal vises.

fetch(endpoint) henter kategorierne fra API'et.

response.ok kontrollerer, om serveren har sendt et vellykket svar.

response.json() omdanner svaret til JavaScript-data.

.then(visKategorier) sender kategorierne videre til funktionen visKategorier.

.catch(visFejl) viser en fejlbesked, hvis API-kaldet fejler.

visKategorier(kategorier) modtager listen med kategorier.

replaceChildren() rydder containeren, inden kategorierne sættes ind.

forEach() gentager koden for hver kategori i arrayet.

document.createElement("a") opretter et link til kategorien.

URLSearchParams opbygger en korrekt kodet cat-parameter, også når kategorinavnet har mellemrum.

kategoriLink.href sender brugeren til productlist.html med den valgte kategori i URL'en.

kategoriLink.textContent viser kategorinavnet som linkets tekst.

appendChild() indsætter kategorilinket i containeren på forsiden.

visFejl() skriver en fejlbesked i kategorilisten, hvis data ikke kan hentes.
*/
