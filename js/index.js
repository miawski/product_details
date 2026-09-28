const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const categoryListContainer = document.querySelector("#categoryListContainer");
const brandStrip = document.querySelector(".brand-strip");
const brandLogoSources = {
  puma: "https://cdn.simpleicons.org/puma",
  nike: "https://cdn.simpleicons.org/nike",
  esprit: "https://upload.wikimedia.org/wikipedia/commons/0/07/Esprit_Holdings_logo.svg",
  edhardy:
    "https://static.wixstatic.com/media/476552_b088aa3d6cc8497e9701b95d5e58b7be~mv2.png/v1/crop/x_0%2Cy_247%2Cw_800%2Ch_239/fill/w_311%2Ch_93%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/Ed%20Hardy%20Logo%20-%20White.png",
};

fetch(endpoint)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Categories could not be loaded.");
    }

    return response.json();
  })
  .then(renderCategories)
  .catch(showError);

async function renderCategories(categories) {
  categoryListContainer.replaceChildren();
  const samples = await Promise.all(categories.map(loadCategorySample));

  categories.forEach((category, index) => {
    const categoryLink = document.createElement("a");
    const params = new URLSearchParams({ cat: category.category });
    const caption = document.createElement("div");
    const categoryName = document.createElement("h3");
    const product = samples[index];

    categoryLink.className = "category-card";
    categoryLink.href = `productlist.html?${params.toString()}`;
    if (product) {
      const image = document.createElement("img");
      image.src = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
      image.alt = "";
      image.loading = "lazy";
      categoryLink.appendChild(image);
    }

    caption.className = "category-caption";
    categoryName.textContent = category.category;
    caption.appendChild(categoryName);
    categoryLink.appendChild(caption);
    categoryListContainer.appendChild(categoryLink);
  });

  renderBrandLogos(samples);
}

async function loadCategorySample(category) {
  const url = `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(category.category)}&limit=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const products = await response.json();
    return products[0] || null;
  } catch {
    return null;
  }
}

function renderBrandLogos(products) {
  brandStrip.replaceChildren();
  const brands = [...new Map(
    products
      .filter((product) => product?.brandname)
      .map((product) => {
        const brandName = product.brandname.trim();
        const brandKey = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
        return [brandKey, { brandName, logoSource: brandLogoSources[brandKey] }];
      })
      .filter(([, brand]) => brand.logoSource),
  ).values()];

  brands.forEach((brand) => {
    const logo = document.createElement("img");
    logo.className = "brand-logo";
    logo.src = brand.logoSource;
    logo.alt = brand.brandName;
    logo.loading = "lazy";
    logo.addEventListener("error", () => {
      logo.remove();
      brandStrip.hidden = brandStrip.childElementCount === 0;
    });
    brandStrip.appendChild(logo);
  });

  brandStrip.hidden = brands.length === 0;
}

function showError() {
  categoryListContainer.textContent = "Categories could not be loaded right now.";
}

/*
 Explanation:

endpoint stores the address of KEA's categories API.

categoryListContainer selects the empty HTML element where the categories will appear.

brandStrip selects the yellow band where logos for API product brands will appear.

brandLogoSources maps normalized API brand names to matching logo image URLs.

fetch(endpoint) requests the categories from the API.

response.ok checks whether the server returned a successful response.

response.json() converts the response into JavaScript data.

.then(renderCategories) passes the categories to the renderCategories function.

.catch(showError) displays an error message if the API request fails.

renderCategories(categories) receives the category list.

loadCategorySample() requests one product from each category to supply its category-card image.

renderBrandLogos(samples) extracts unique brand names from the category product samples, matches known names to their logo URLs, and inserts only the matching logos.

The brand key removes spaces and punctuation so values such as "Ed Hardy" match the "edhardy" logo key.

The image error listener removes a logo that fails to load and hides the strip if no usable logos remain.

replaceChildren() clears the container before the categories are added.

forEach() repeats the code for every category in the array.

document.createElement("a") creates a link for a category.

URLSearchParams creates an encoded cat parameter, including when a category name contains spaces.

categoryLink.href sends the user to productlist.html with the selected category in the URL.

categoryName sets the category label, and caption contains only that label without an arrow.

appendChild() inserts the category link into the container on the home page.

showError() displays a message in the category list if the data cannot be loaded.
*/
