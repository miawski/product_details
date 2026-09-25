const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const categoryListContainer = document.querySelector("#categoryListContainer");

fetch(endpoint)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Categories could not be loaded.");
    }

    return response.json();
  })
  .then(renderCategories)
  .catch(showError);

function renderCategories(categories) {
  categoryListContainer.replaceChildren();

  categories.forEach((category) => {
    const categoryLink = document.createElement("a");
    const params = new URLSearchParams({ cat: category.category });

    categoryLink.href = `productlist.html?${params.toString()}`;
    categoryLink.textContent = category.category;
    categoryListContainer.appendChild(categoryLink);
  });
}

function showError() {
  categoryListContainer.textContent = "Categories could not be loaded right now.";
}

/*
 Explanation:

endpoint stores the address of KEA's categories API.

categoryListContainer selects the empty HTML element where the categories will appear.

fetch(endpoint) requests the categories from the API.

response.ok checks whether the server returned a successful response.

response.json() converts the response into JavaScript data.

.then(renderCategories) passes the categories to the renderCategories function.

.catch(showError) displays an error message if the API request fails.

renderCategories(categories) receives the category list.

replaceChildren() clears the container before the categories are added.

forEach() repeats the code for every category in the array.

document.createElement("a") creates a link for a category.

URLSearchParams creates an encoded cat parameter, including when a category name contains spaces.

categoryLink.href sends the user to productlist.html with the selected category in the URL.

categoryLink.textContent sets the category name as the link text.

appendChild() inserts the category link into the container on the home page.

showError() displays a message in the category list if the data cannot be loaded.
*/
