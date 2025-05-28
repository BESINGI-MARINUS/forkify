import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const formatRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    title: recipe.title,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = formatRecipeObj(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.result = data.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultpage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

const persistBoommarks = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Update bookmark Array
  state.bookmarks.push(recipe);
  persistBoommarks();

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  // Delete recipe from bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  persistBoommarks();

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

const init = function () {
  const storage = JSON.parse(localStorage.getItem('bookmark'));
  if (storage) state.bookmarks = storage;
};
init();

const clearLocalStorage = function () {
  localStorage.clear('bookmarks');
};
// clearLocalStorage();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(arr => arr[0].startsWith('ingredient') && arr[1] !== '')
      .map(ing => {
        const ingArr = ing[1].trim().split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingrdients format. Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: !quantity ? null : +quantity,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = formatRecipeObj(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
