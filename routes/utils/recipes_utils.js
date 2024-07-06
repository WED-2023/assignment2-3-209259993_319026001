const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config(); // env



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


// information for preview recipe of a single recipe
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

// function for searching recipe
async function searchRecipe(recipeName, cuisine, diet, intolerance, number, username) {
    try {
        const response = await axios.get(`${api_domain}/complexSearch`, {
            params: {
                query: recipeName,
                cuisine: cuisine,
                diet: diet,
                intolerances: intolerance,
                number: number,
                apiKey: process.env.spooncular_apiKey
            }
        });

        const recipeIds = response.data.results.map(element => element.id);
        const recipesDetails = await Promise.all(recipeIds.map(recipeId => getRecipeDetails(recipeId)));
        
        return recipesDetails;
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}



exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;



