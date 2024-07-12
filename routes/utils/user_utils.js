const DButils = require("./DButils");

// function for marking recipe as favorite of user
// takes in a username and recipe id, and writes to table of favorites in db
async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favorites values ('${user_id}',${recipe_id})`);
}

// get favorite recipes of a user
// takes in a username and returns favorites of user in db as a list
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipeId from favorites where username='${user_id}'`);
    return recipes_id;
}

// function for marking recipe as viewed of user
// takes in a username, recipe id and date of viewing
// if pair of recipe id and username not exist, writes to table of viewed in db
// if exist, modify date
async function markAsViewed(user_id, recipe_id, date){
    const query = `
    INSERT INTO viewed values ('${user_id}',${recipe_id}, '${date}')
    ON DUPLICATE KEY UPDATE lastViewed = '${date}'`;
    await DButils.execQuery(query);
}

// get viewed recipes of a user 
// takes in a username and returns viewed recipes of user in db as a list
async function getAllViewedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipeId from viewed where username='${user_id}'`);
    return recipes_id;
}

// get last viewed recipes of a user
// takes in a username and returns last viewed recipes of user in db as a list
async function getLastViewwedRecipes(user_id, numberOfRecipes=3){
    const query = `SELECT recipeId, username, lastViewed
    FROM viewed
    WHERE username = '${user_id}'
    ORDER BY lastViewed DESC
    LIMIT ${numberOfRecipes};`
    const recipes_id = await DButils.execQuery(query);
    return recipes_id;
}

// get full instructions of recipes of a user
// takes in a username and recipe id and returns full instructions of recipes of user in db as a json list
async function getUsersRecipesInstructions(user_id, recipe_id){
  const query = `
  SELECT 
      r.title, r.image, r.readyInMinutes, r.servings, r.vegetarian, r.vegan, r.glutenFree,
      i.step AS instruction, 
      ing.name AS ingredient, ing.amount, ing.unit,
      eq.name AS equipment
  FROM recipes r
  LEFT JOIN recipe_instructions i ON r.recipeId = i.recipeId
  LEFT JOIN recipe_ingredients ing ON i.instructionId = ing.instructionId
  LEFT JOIN recipe_equipment eq ON i.instructionId = eq.instructionId
  WHERE r.username = '${user_id}' AND r.recipeId = ${recipe_id}`;

  try {
      const results = await DButils.execQuery(query);

      const recipes = {};

      results.forEach(row => {
          const title = row.title;

          if (!recipes[title]) {
              recipes[title] = {
                  title: title,
                  image: row.image,
                  readyInMinutes: row.readyInMinutes,
                  servings: row.servings,
                  vegetarian: row.vegetarian,
                  vegan: row.vegan,
                  glutenFree: row.glutenFree,
                  instructions: []
              };
          }

          let instructionObj = recipes[title].instructions.find(inst => inst.step === row.instruction);

          if (!instructionObj) {
              instructionObj = {
                  step: row.instruction,
                  ingredients: [],
                  equipment: []
              };
              recipes[title].instructions.push(instructionObj);
          }

          if (row.ingredient) {
              const ingredientObj = {
                  name: row.ingredient,
                  amount: row.amount,
                  unit: row.unit
              };
              instructionObj.ingredients.push(ingredientObj);
          }

          if (row.equipment) {
              const equipmentObj = {
                  name: row.equipment
              };
              instructionObj.equipment.push(equipmentObj);
          }
      });

      const recipesList = Object.values(recipes);
      const recipesJson = JSON.stringify(recipesList, null, 4);

      return recipesJson;

  } catch (err) {
      console.error('Error exporting recipe to JSON:', err);
      throw err;
  }
}

// get recipes of a user
// takes in a username and returns recipes of user in db as a json list 
async function getUsersRecipes(user_id){
      // SQL query to get recipes of user
      const query = `
      SELECT r.username, r.recipeId, r.image, r.title, r.readyInMinutes, r.servings, r.vegetarian, r.vegan, r.glutenFree
      FROM recipes r
      WHERE r.username = '${user_id}'`;
      try {
           // execute the query
          const results = await DButils.execQuery(query);
      
          // Process the results
          const recipes = {};
          results.forEach(row => {
            const recipeId = row.recipeId;
      
            if (!recipes[recipeId]) {
              recipes[recipeId] = {
                username: row.username,
                recipeId: recipeId,
                image: row.image,
                title: row.title,
                readyInMinutes: row.readyInMinutes,
                servings: row.servings,
                vegetarian: row.vegetarian,
                vegan: row.vegan,
                glutenFree: row.glutenFree
              };
            }
          });
      
          // Convert to list format
          const recipesList = Object.values(recipes);
      
          // Convert to JSON
          const recipesJson = JSON.stringify(recipesList, null, 4);
      
          // Return the JSON
          return recipesJson;
      
        } catch (err) {
          console.error('Error exporting recipes to JSON:', err);
          throw err;
        }
}

// function for adding recipe to user's list of recipes
// takes in a recipe in json and writes it to db
async function addUserRecipe(recipe){
  // Insert into recipes table
  const recipeInsertQuery = `
  INSERT INTO recipes (username, title, image, readyInMinutes, servings, vegetarian, vegan, glutenFree)
  VALUES ('${recipe.username}', '${recipe.title}', '${recipe.image}', ${recipe.readyInMinutes}, ${recipe.servings}, ${recipe.vegetarian}, ${recipe.vegan}, ${recipe.glutenFree})
  `;
  try {
    // execute the query and save result
    const results = await DButils.execQuery(recipeInsertQuery);
    i = 1
    // iterate instructions of recipe
    for (const instruction of recipe.instructions) {
      // query for inserting instructions
      const instructionInsertQuery = `
          INSERT INTO recipe_instructions (recipeId, step, step_description)
          VALUES (${results.insertId}, ${i}, '${instruction.step}')
      `;
      // save results
      const insResults = await DButils.execQuery(instructionInsertQuery);

      // iterate ingredients of instruction
      for (const ingredient of instruction.ingredients) {
        const ingredientInsertQuery = `
            INSERT INTO recipe_ingredients (instructionId, name, amount, unit)
            VALUES (${insResults.insertId}, '${ingredient.name}', ${ingredient.amount}, '${ingredient.unit}')
        `;
        await DButils.execQuery(ingredientInsertQuery);
        i = i + 1;
    }

      // iterate equipment of instruction
      for (const equipment of instruction.equipment) {
        const equipmentInsertQuery = `
            INSERT INTO recipe_equipment (instructionId, name)
            VALUES (${insResults.insertId}, '${equipment.name}')
        `;
        await DButils.execQuery(equipmentInsertQuery);
    }
    }

  } catch (err) {
    console.error('Error exporting recipes to JSON:', err);
    throw err;
  }
}

// get family recipes of a user
// takes in a username and returns recipes of user in db as json
async function getFamilyRecipes(user_id){
    // SQL query to join family_recipes and recipe_instructions with a filter for a specific user
    const query = `
    SELECT r.username, r.recipeId, r.image, r.title, r.readyInMinutes, r.owner, r.whenToMake, r.summary, r.ingredients,
         i.instructionIndex, i.instruction
    FROM family_recipes r
    LEFT JOIN family_recipe_instructions i ON r.username = i.username AND r.recipeId = i.recipeId
    WHERE r.username = 'lior'`;
    try {
         // execute the query
        const results = await DButils.execQuery(query);
    
        // Process the results
        const recipes = {};
        results.forEach(row => {
          const recipeId = row.recipeId;
    
          if (!recipes[recipeId]) {
            recipes[recipeId] = {
              username: row.username,
              recipeId: recipeId,
              image: row.image,
              title: row.title,
              readyInMinutes: row.readyInMinutes,
              owner: row.owner,
              whenToMake: row.whenToMake,
              summary: row.summary,
              ingredients: JSON.parse(row.ingredients),
              instructions: []
            };
          }
    
          if (row.instructionIndex !== null) {
            recipes[recipeId].instructions.push({
              index: row.instructionIndex,
              instruction: row.instruction
            });
          }
        });
    
        // Convert to list format
        const recipesList = Object.values(recipes);
    
        // Convert to JSON
        const recipesJson = JSON.stringify(recipesList, null, 4);
    
        // Return the JSON
        return recipesJson;
    
      } catch (err) {
        console.error('Error exporting recipes to JSON:', err);
        throw err;
      }
}

// function for adding a recipe to user's meal
// takes in a username and recipe id, and writes to table of meal in db
async function addoToMeal(user_id, recipe_id){
    await DButils.execQuery(`insert into meal values ('${user_id}',${recipe_id})`);
}

// function for removing a recipe from user's meal
// takes in a username and recipe id, and deletes from table of meal in db
async function RemoveFromMeal(user_id, recipe_id){
    await DButils.execQuery(`DELETE FROM meal WHERE username = '${user_id}' and recipeId = ${recipe_id}`);
    console.log('Recipe deleted from meal successfully.');
}

// get meal recipes of a user
// takes in a username and returns recipes of meal of user in db as a list
async function getMealRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipeId from meal where username='${user_id}'`);
    return recipes_id;
}

// function that takes in username and recipe id, and checks if the user favorited the recipe
async function isFavorite(username, recipeId) {
    const query = `SELECT * FROM favorites WHERE username = '${username}' AND recipeId = ${recipeId}`;
    const results = await DButils.execQuery(query);
    return results.length > 0;
}

// function that takes in username and recipe id, and checks if the user viewed the recipe
async function isViewed(username, recipeId) {
  const query = `SELECT * FROM viewed WHERE username = '${username}' AND recipeId = ${recipeId}`;
  const results = await DButils.execQuery(query);
  return results.length > 0;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getAllViewedRecipes = getAllViewedRecipes;
exports.getUsersRecipes = getUsersRecipes;
exports.getUsersRecipesInstructions = getUsersRecipesInstructions;
exports.addUserRecipe = addUserRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getLastViewwedRecipes = getLastViewwedRecipes;
exports.getMealRecipes = getMealRecipes;
exports.addoToMeal = addoToMeal;
exports.RemoveFromMeal = RemoveFromMeal;
exports.isFavorite = isFavorite;
exports.isViewed = isViewed;
