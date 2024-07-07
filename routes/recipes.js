var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
require('dotenv').config(); // env

router.get("/", (req, res) => res.send("im here"));

/**
 * This path is for searching a recipe in the api
 */
router.get("/search", async (req, res, next) => {
  try {
    const recipeName = req.query.recipeName;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    const number = req.query.number || 5;
    const results = await recipes_utils.searchRecipe(recipeName, cuisine, diet, intolerance, number);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id from the api
 */
router.get("/get/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns random recipes preview from api
 */
router.get("/random", async (req, res, next) => {
  try {
    // set default number
    numOfRec = 3;
    // if in parameters, change number
    if (req.params.numOfRecipes) {
      numOfRec = req.params.numOfRecipes;
    }
    const recipe = await recipes_utils.getRandomRecipes(numOfRec);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id from the api
 */
router.get("/instructions/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getInstructions(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
