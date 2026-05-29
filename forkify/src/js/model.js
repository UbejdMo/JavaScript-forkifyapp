import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query:'',
    results: [],
    page:1,
    resultsPerPage: RES_PER_PAGE,
  },
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id:rec.id,
                title:rec.title,
                publisher: rec.publisher,
                image:rec.image_url,
                ...(rec.key && {key:rec.key }),
            };
        });
        state.search.page = 1;
    }
    catch (err){
        console.error(`${err}`);
        throw err;
    }
};