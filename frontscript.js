const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const searchInput = document.getElementById('search');

// Display recipes from server
async function fetchRecipes(query = '') {
  const url = query ? `http://localhost:3000/search?q=${query}` : `http://localhost:3000/recipes`;
  const res = await fetch(url);
  const recipes = await res.json();
  displayRecipes(recipes);
}

function displayRecipes(recipes) {
  recipeList.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
    `;
    recipeList.appendChild(card);
  });
}

recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('recipe-name').value.trim();
  const ingredients = document.getElementById('ingredients').value.split(',').map(i => i.trim());
  const steps = document.getElementById('steps').value.trim();
  const imageInput = document.getElementById('image');

  if (!name || !ingredients.length || !steps || !imageInput.files.length) return alert('Please fill all fields');

  const reader = new FileReader();
  reader.onload = async function () {
    const newRecipe = { name, ingredients, steps, image: reader.result };

    await fetch('http://localhost:3000/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe)
    });

    fetchRecipes(); // reload recipes
    recipeForm.reset();
  };
  reader.readAsDataURL(imageInput.files[0]);
});

searchInput.addEventListener('input', () => {
  fetchRecipes(searchInput.value);
});

// Initial fetch
fetchRecipes();
