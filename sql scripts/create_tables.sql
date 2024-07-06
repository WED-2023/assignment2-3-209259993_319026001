USE recipes;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (username, country, password, email) VALUES
('lior', 'Israel', 'lior@4', 'lioraftabi@gmail.com'),
('noa', 'Israel', 'a!1', 'noa@gmail.com'),
('ido', 'Israel', '1dodo$', 'ido@gmail.com'),
('itay', 'Israel', 'mess!3', 'itay@gmail.com');

CREATE TABLE favorites (
    username VARCHAR(50),
    recipeId INT,
    PRIMARY KEY (username, recipeId),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO favorites (username, recipeId) VALUES
('lior', 716429),
('lior', 324694),
('noa', 716429),
('ido', 716430),
('itay', 716431);

CREATE TABLE viewed (
    username VARCHAR(50),
    recipeId INT,
    lastViewed DATE,
    PRIMARY KEY (username, recipeId),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO viewed (username, recipeId, lastViewed) VALUES
('lior', 716429, '2024-07-01'),
('lior', 324694, '2024-07-01'),
('noa', 716429, '2024-07-03'),
('ido', 716430, '2024-07-03'),
('itay', 716431,'2024-07-04'),
('lior', 716431, '2024-07-04');

CREATE TABLE searched (
    username VARCHAR(50),
    recipeId INT,
    lastSearched DATE,
    PRIMARY KEY (username, recipeId),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO searched (username, recipeId, lastSearched) VALUES
('lior', 716429, '2024-06-29'),
('lior', 324694, '2024-06-29'),
('noa', 716429, '2024-07-02'),
('ido', 716430, '2024-07-01'),
('itay', 716431,'2024-07-01'),
('lior', 716431, '2024-07-03');

CREATE TABLE family_recipes (
    username VARCHAR(50),
    recipeId INT,
    image VARCHAR(255),
    title VARCHAR(100),
    readyInMinutes INT,
    owner VARCHAR(100),
    whenToMake VARCHAR(100),
    summary TEXT,
    ingredients TEXT,
    PRIMARY KEY (username, recipeId),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO family_recipes (username, recipeId, image, title, readyInMinutes, owner, whenToMake, summary, ingredients) VALUES
('lior2', 1, 'https://www.allrecipes.com/thmb/oIBbjuG9rjXDmr5IdFPLM97DOhs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/257499-ghormeh-sabzi-persian-herb-stew-DDMFS-beauty-4x3-BG-2923-0a3327d626ca4b848bd1d1ebd7ca331d.jpg', 
 'Ghormeh Sabzi', 180, 'Grandmother Rachel', 'Shabbat', 
 'Horshat sabzi or gourmet sabzi is a vegetable and meat stew that is considered the flagship dish in Iranian cuisine. A sour dish whose ingredients are fresh and dried green vegetables that are cooked together with beef and red beans in a long cooking process. The dish is usually eaten on special occasions and on Shabbat, and it is usually served with white rice.',
 '["2 bunches of parsley", "2 bunches of dill", "2 bunches of coriander", "A quarter of a bunch of mint", "2 large onions", "2 leeks", "2 tablespoons of tomato paste", "Olive oil", "1 and a half kg of beef", "3 cups of water", "1 and a half cups of red beans", "4 Persian lemons", "Salt to taste", "2 teaspoons of turmeric", "1 teaspoon cumin", "2-3 tablespoons of pomegranate concentrate"]');


CREATE TABLE family_recipe_instructions (
    username VARCHAR(50),
    recipeId INT,
    instructionIndex INT,
    instruction TEXT,
    PRIMARY KEY (username, recipeId, instructionIndex),
    FOREIGN KEY (username, recipeId) REFERENCES family_recipes(username, recipeId)
);

INSERT INTO family_recipe_instructions (username, recipeId, instructionIndex, instruction) VALUES
('lior2', 1, 1, 'Wash the herbs and dry thoroughly, separate the leaves and chop well.'),
('lior2', 1, 2, 'Cut one onion thinly and fry in a little oil in a wide pan, add chopped leek.'),
('lior2', 1, 3, 'Add the tomato paste and continue frying.'),
('lior2', 1, 4, 'When the onion and leek are fried, add the herbs, fry for a few more minutes and remove from the heat. Set aside.'),
('lior2', 1, 5, 'Chop the second onion and fry it in olive oil in a separate pot. Cut the meat into cubes approximately 4 cm by 4 cm. Add the meat cubes to the chopped onion and fry to close the meat cubes.'),
('lior2', 1, 6, 'Add the water and the beans and cook for about two hours until the meat and beans are soft and cooked.'),
('lior2', 1, 7, 'Add the herbs and mix. Add the lemon powder to the stew with salt, turmeric, cumin and pomegranate concentrate.'),
('lior2', 1, 8, 'Cook for another hour on low heat.');

CREATE TABLE meal (
    username VARCHAR(50),
    recipeId INT,
    PRIMARY KEY (username, recipeId),
    FOREIGN KEY (username) REFERENCES users(username)
);

INSERT INTO meal (username, recipeId) VALUES
('lior', 716429),
('noa', 716429);

-- Creating the recipes table
CREATE TABLE recipes (
    recipeId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(8),
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    readyInMinutes INT NOT NULL,
    servings INT NOT NULL,
    vegetarian BOOLEAN NOT NULL,
    vegan BOOLEAN NOT NULL,
    glutenFree BOOLEAN NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);

-- Creating the recipe_instructions table
CREATE TABLE recipe_instructions (
    instructionId INT AUTO_INCREMENT PRIMARY KEY,
    recipeId INT,
    step INT NOT NULL,
    step_description TEXT NOT NULL,
    FOREIGN KEY (recipeId) REFERENCES recipes(recipeId)
);

-- Creating the recipe_ingredients table
CREATE TABLE recipe_ingredients (
    ingredientId INT AUTO_INCREMENT PRIMARY KEY,
    instructionId INT,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    FOREIGN KEY (instructionId) REFERENCES recipe_instructions(instructionId)
);

CREATE TABLE recipe_equipment (
    equipmentId INT AUTO_INCREMENT PRIMARY KEY,
    instructionId INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (instructionId) REFERENCES recipe_instructions(instructionId)
);









