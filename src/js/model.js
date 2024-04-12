import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: [],
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    //storing data in State
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    //setting the bookmark property for each recipe which will get loads
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //console.error(err);
    throw err;
  }
};

export const loadRecipeSearch = async function (query) {
  try {
    //saving the query in state
    state.search.query.push(query.toLowerCase());

    //calling function to fetch promise
    const data = await getJSON(`${API_URL}?search=${query}`);
    //console.log(data.data.recipes);

    //saving the recipe data from search results in State variable
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
      };
    });

    //update the default page no. which get affected by pagination method from previous search results
    state.search.page = 1;
    //console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  //console.log(state.search.results);

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const getUpdatedServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
  });

  state.recipe.servings = newServing;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Please enter the ingredients in correct format as mentioned!'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: newRecipe.cookingTime,
      id: newRecipe.id,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
