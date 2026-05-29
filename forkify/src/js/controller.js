import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Show a loading spinner immediately
    recipeView.renderSpinner();

    // 2) Load the recipe (async)
    await model.loadRecipe(id);

    // 3) Render it
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // Render ONLY the current page of results
    resultsView.render(model.getSearchResultsPage());

    // Render the pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW page of results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();