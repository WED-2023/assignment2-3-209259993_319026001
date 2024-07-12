var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/:username/favorites', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 * used for favorites page itself
 */
router.get('/:username/favorites', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    console.log(recipes_id);
    let recipes_id_array = recipes_id.map(element => element.recipeId);
    console.log(recipes_id_array);
    // Fetch recipe details for each recipeId
    const promises = recipes_id_array.map(async recipeId => {
      try {
        return await recipe_utils.getRecipeDetails(recipeId);
      } catch (error) {
        // Handle errors for individual recipe details fetch
        console.error(`Error fetching details for recipeId ${recipeId}:`, error);
        return;
      }
    });
    // Execute all promises concurrently
    const results = await Promise.all(promises);
    res.status(200).send(results);
  } catch (error) {
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/:username/favorites', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes (only ids, used for marking) that were saved by the logged-in user
 */
router.get('/:username/favoritesID', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    console.log(recipes_id);
    let recipes_id_array = recipes_id.map(element => element.recipeId);
    console.log(recipes_id_array);
    res.status(200).send(recipes_id_array);
  } catch (error) {
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the viewed recipes list of the logged-in user, along with current date
 * as viewing date.
 */
router.post('/:username/view', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.body.recipeId;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format date as yyyy-mm-dd hh:mm:ss
    await user_utils.markAsViewed(username,recipe_id,currentDate);
    res.status(200).send("The Recipe successfully marked as viewed");
    } catch(error){
    next(error);
  }
});

/**
 * This path returns the recipes that were viewed by the logged-in user
 */
router.get('/:username/view', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes_id = await user_utils.getAllViewedRecipes(username);
    console.log(recipes_id);
    let recipes_id_array = recipes_id.map(element => element.recipeId);
    res.status(200).send(recipes_id_array);
  } catch (error) {
    next(error); 
  }
});


/**
 * This path gets username and returns a json of his family recipes from database
 */
router.get('/:username/family', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes = await user_utils.getFamilyRecipes(username);
    res.status(200).send(recipes);
    } catch(error){
    next(error);
  }
});

/**
 * This path gets body with recipe information and save this recipe in the database as a recipe of the logged-in user
 */
router.post('/:username/recipes', async (req,res,next) => {
  try{
    const recipe = req.body;
    await user_utils.addUserRecipe(recipe)
    res.status(200).send("The Recipe was added to user's recipes successfully");
    } catch(error){
    next(error);
  }
});

/**
 * This path gets username and returns a json of his recipes from database
 */
router.get('/:username/recipes', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes = await user_utils.getUsersRecipes(username);
    res.status(200).send(recipes);
    } catch(error){
    next(error);
  }
});

/**
 * This path gets username and number of recipes, and returns a json of his 
 * last viewed number of recipes from database
 */
router.get('/:username/lastViewed', async (req,res,next) => {
  try{
    const username = req.params.username;
    const numberOfRecipes = req.params.numberOfRecipes;
    if (numberOfRecipes === undefined) {
      const lastRecipesIds = await user_utils.getLastViewwedRecipes(username);
      const recipes = await recipe_utils.fetchRecipes(lastRecipesIds);
      res.status(200).send(recipes);
    }
    else {
      const lastRecipesIds = await user_utils.getLastViewwedRecipes(username, numberOfRecipes);
      const recipes = await recipe_utils.fetchRecipes(lastRecipesIds);
      res.status(200).send(recipes);
    }
    } catch(error){
    next(error);
  }
});

/**
 * This path gets username and returns preview of recipes in current meal
 */
router.get('/:username/meal', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipes_id = await user_utils.getMealRecipes(username);
    let recipes_id_array = recipes_id.map(element => element.recipeId);
    // Fetch recipe details for each recipeId
    const promises = recipes_id_array.map(async recipeId => {
      try {
        return await recipe_utils.getRecipeDetails(recipeId);
      } catch (error) {
        // Handle errors for individual recipe details fetch
        console.error(`Error fetching details for recipeId ${recipeId}:`, error);
        return;
      }
    });
    // Execute all promises concurrently
    const results = await Promise.all(promises);
    res.status(200).send(results);
  } catch (error) {
    next(error); 
  }
});

/**
 * This path gets body with recipeId and adds this recipe to the meal recipes list of the logged-in user
 */
router.post('/:username/meal/add', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.body.recipeId;
    await user_utils.addoToMeal(username,recipe_id);
    res.status(200).send("The Recipe successfully added to meal");
    } catch(error){
    next(error);
  }
});

/**
 * This path gets body with recipeId and removes this recipe from the meal recipes list of the logged-in user
 */
router.post('/:username/meal/remove', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.body.recipeId;
    await user_utils.RemoveFromMeal(username,recipe_id);
    res.status(200).send("The Recipe was removed from meal successfully");
    } catch(error){
    next(error);
  }
});

/**
 * This path gets username and recipeId, and returns true if the recipe was favorited by user. else, returns false
 */
router.get('/:username/isFavorite', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.query.recipeId;
    const response = await user_utils.isFavorite(username, recipe_id);
    res.status(200).send(response);
    } catch(error){
    next(error);
  }
});

/**
 * This path gets username and recipeId, and returns true if the recipe was viewed by user. else, returns false
 */
router.get('/:username/isViewed', async (req,res,next) => {
  try{
    const username = req.params.username;
    const recipe_id = req.query.recipeId;
    const response = await user_utils.isViewed(username, recipe_id);
    res.status(200).send(response);
    } catch(error){
    next(error);
  }
});




module.exports = router;
