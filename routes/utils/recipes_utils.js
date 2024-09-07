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


// information for preview recipe and recipe page of a single recipe
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, servings, aggregateLikes, vegan, vegetarian, glutenFree, instructions, extendedIngredients } = recipe_info.data;

    return {
        id: id,
        title: title,
        servings: servings,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instructions: instructions,
        extendedIngredients: extendedIngredients

    }
}

// information for preview recipe and recipe page of a single recipe
async function getRecipePreview(recipe_id) {
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

// function for fetching recipes
async function fetchRecipes(recipes_id) {
    const recipes = [];
    for (const recipe of recipes_id) {
        const response = await getRecipePreview(recipe.recipeId);
        recipes.push(response);
    }
    return {
        recipes: recipes
    };
}

// function for searching recipe
async function searchRecipe(search, cuisine, diet, intolerance, number) {
    try {
        const params = {};
        if (search) params.query = search;
        if (cuisine) params.cuisine = cuisine;
        if (diet) params.diet = diet;
        if (intolerance) params.intolerances = intolerance;
        if (number) params.number = number;
        params.apiKey = process.env.spooncular_apiKey;
        const response = await axios.get(`${api_domain}/complexSearch`, {params});
        const recipeIds = response.data.results.map(element => element.id);
        const recipesDetails = await Promise.all(recipeIds.map(recipeId => getRecipePreview(recipeId)));
        return recipesDetails;
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}

// function that takes in a number of recipes (optional), and returns random recipes in that number
async function getRandomRecipes(numOfRecipes=3) {
    try {
        const response = await axios.get(`${api_domain}/random`, {
            params: {
                number: numOfRecipes,
                apiKey: process.env.spooncular_apiKey
            }
        });
        const recipeIds = response.data.recipes.map(element => element.id);
        const recipesDetails = await Promise.all(recipeIds.map(recipeId => getRecipePreview(recipeId)));
        return recipesDetails;
    } catch (error) {
        console.log("Error fetching recipes:", error);
    }
}

// function that takes in a recipe id, and returns the full instructions of that recipe
async function getInstructions(recipeId) {
    try {
        // get analayzed instructions of recipe
        const response = await axios.get(`${api_domain}/${recipeId}/analyzedInstructions`, {
            params: {
                apiKey: process.env.spooncular_apiKey
            }
        });
        const data = JSON.stringify(response.data, null, 2);
        return data;
    } catch (error) {
        console.log("Error fetching instructions:", error);
    }
}



exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.getRandomRecipes = getRandomRecipes;
exports.getInstructions = getInstructions;
exports.fetchRecipes = fetchRecipes;


