import * as model from './model.js';
import recipeView from './views/recipeView.js';

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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();