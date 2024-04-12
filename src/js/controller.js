import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipe = async function () {
  try {
    //generate ID from hashchange
    const id = window.location.hash.slice(1);
    if (!id) return;

    //update selected recipe as marked result
    resultsView.update(model.getSearchResultsPerPage());
    bookmarkView.update(model.state.bookmarks);

    //load recipe
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.errorHandler();
  }
};

const controlRecipeSearch = async function () {
  try {
    paginationView.renderSpinner();
    //get query from SearchView
    const query = searchView.getQuery();
    if (!query) return;

    //call the promise fetch from Model
    await model.loadRecipeSearch(query);

    //render the result from promise
    // console.log(model.state.search.results);
    // console.log(model.state.search.query);
    // const arr = model.getSearchResultsPerPage(1);
    // console.log(arr);
    resultsView.render(model.getSearchResultsPerPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  //render new search results
  resultsView.render(model.getSearchResultsPerPage(gotoPage));

  //render new pageination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (updateTo) {
  model.getUpdatedServing(updateTo);

  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  //add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //update the recipe view after adding or removing bookmark
  recipeView.update(model.state.recipe);

  //render the bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarksOnLoad = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    //loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);

    //render new recipe
    recipeView.render(model.state.recipe);
    //render the bookmark
    bookmarkView.render(model.state.bookmarks);
    //render success message
    addRecipeView.renderMessage();

    //removing the model window
    setTimeout(function () {
      addRecipeView._toggleHidden();
    }, 2500);
  } catch (err) {
    addRecipeView.errorHandler(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerLoadBookmarks(controlBookmarksOnLoad);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  recipeView.addHandler(controlRecipe);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerBookmark(controlBookmarks);
  searchView.addHandlerSearch(controlRecipeSearch);
  paginationView.addHandler(controlPagination);
};

init();
