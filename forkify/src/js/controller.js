import * as model from './model.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    await model.loadRecipe(id);
  } catch (err) {
    console.error(err);
  }
};

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));