import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import ResultView from './view/ResultView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { CLOSE_FORM_SEC } from './config.js';

import 'core-js/stable'; //For polyfilling everything else in order to support really old browsers
import 'regenerator-runtime/runtime'; //For polyfilling async-await

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0. Mark selected recipe on the results view
    ResultView.update(model.getSearchResultpage());

    //1. Load recipe
    await model.loadRecipe(id);

    //2. Rendering the recipe
    recipeView.render(model.state.recipe);

    // Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    model.state.search.page = 1;

    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    ResultView.renderSpinner();

    //2. Load search query
    await model.loadSearchResults(query);

    //3. Render result
    ResultView.render(model.getSearchResultpage());

    //4. Render initial pagination button.
    paginationView.render(model.state.search);
  } catch (err) {
    ResultView.renderError();
    console.log(err);
  }
};

const controlPagination = function (pageNum) {
  //3. Render new result
  ResultView.render(model.getSearchResultpage(pageNum));

  //4. Render new pagination button.
  paginationView.render(model.state.search);
};

const controlServings = function (numServings) {
  // Update the recipe servings (in state)
  model.updateServings(numServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlRenderBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (recipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(recipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderSuccess();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleHiddenClass();
    }, CLOSE_FORM_SEC * 1000);

    // Re-render bookmarks view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmarks);
  bookmarkView.addHandlerRender(controlRenderBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlUploadRecipe);
};

init();
