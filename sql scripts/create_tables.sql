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
('lior', 1, 'https://www.allrecipes.com/thmb/oIBbjuG9rjXDmr5IdFPLM97DOhs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/257499-ghormeh-sabzi-persian-herb-stew-DDMFS-beauty-4x3-BG-2923-0a3327d626ca4b848bd1d1ebd7ca331d.jpg', 
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
('lior', 1, 1, 'Wash the herbs and dry thoroughly, separate the leaves and chop well.'),
('lior', 1, 2, 'Cut one onion thinly and fry in a little oil in a wide pan, add chopped leek.'),
('lior', 1, 3, 'Add the tomato paste and continue frying.'),
('lior', 1, 4, 'When the onion and leek are fried, add the herbs, fry for a few more minutes and remove from the heat. Set aside.'),
('lior', 1, 5, 'Chop the second onion and fry it in olive oil in a separate pot. Cut the meat into cubes approximately 4 cm by 4 cm. Add the meat cubes to the chopped onion and fry to close the meat cubes.'),
('lior', 1, 6, 'Add the water and the beans and cook for about two hours until the meat and beans are soft and cooked.'),
('lior', 1, 7, 'Add the herbs and mix. Add the lemon powder to the stew with salt, turmeric, cumin and pomegranate concentrate.'),
('lior', 1, 8, 'Cook for another hour on low heat.');

-- Insert into family_recipes table the sekanjabin
INSERT INTO family_recipes (username, recipeId, image, title, readyInMinutes, owner, whenToMake, summary, ingredients) VALUES
('lior', 2, 'https://www.allrecipes.com/thmb/nWlr0GW8xRLtwbpbtElOmSDhpnU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/7127661-sekanjabin-iranian-mint-vinegar-syrup-Diana71-4x3-1-4a9e9ef37e9a441abd64c6c9faaa62eb.jpg', 
 'Sekanjabin', 20, 'Grandfather Navi', 'Hot summer days', 
 'Sekanjabin is a traditional Persian beverage. Great for outdoor events since you can make it weeks ahead of time and dilute at the time of serving. Persians usually drink it on the last day of Nowruz, which is the Persian new year.',
 '["8 cups orange blossom honey", "5 cups water", "2 cups white wine vinegar", "12 large sprigs fresh mint"]');

-- Insert into family_recipe_instructions table the instructions for sekanjabin
INSERT INTO family_recipe_instructions (username, recipeId, instructionIndex, instruction) VALUES
('lior', 2, 1, 'Stir honey and water together in a pot; bring to a boil and stir constantly until honey dissolves.'),
('lior', 2, 2, 'Add vinegar, reduce heat to low, and simmer until syrup flavors combine, about 20 minutes.'),
('lior', 2, 3, 'Submerge mint in hot syrup and cool to room temperature.'),
('lior', 2, 4, 'Remove and discard mint. Chill syrup in the refrigerator.');

-- Insert into family_recipes table the gondi
INSERT INTO family_recipes (username, recipeId, image, title, readyInMinutes, owner, whenToMake, summary, ingredients) VALUES
('lior', 3, 'https://images.prismic.io/jewishfoodsociety/80bdec09-850a-4227-a698-0c853a752738_Shifte%2BSoup_0148.jpeg?auto=compress,format&rect=44,0,1412,971&w=1600&h=1100', 
 'Gondi', 120, 'Grandmother Rachel', 'Passover Seder', 
 'Gondi is a Jewish-Persian dish of round and airy dumplings made from ground chicken meat, hummus and flour made from dry hummus. The gondi is served with the broth in which it was cooked, usually on a bed of white rice. The color of the gundi is yellow, due to the use of the common spice in Persia, turmeric or saffron.',
 '["A kilo of ground chicken breast", "4 peeled medium onions", "3/4 cup ground roasted chickpeas", "A little oil", "Salt and pepper", "A pinch of ground cumin", "A pinch of ground coriander", "A pinch of turmeric", "A pinch of cardamom", "2 tablespoons of chicken soup powder"]');

-- Insert into family_recipe_instructions table the instructions for gondi
INSERT INTO family_recipe_instructions (username, recipeId, instructionIndex, instruction) VALUES
('lior', 3, 1, 'Mix all the meatball ingredients until you get a uniform paste (and not too soft). Put in the fridge for half an hour.'),
('lior', 3, 2, 'Boil water in a pot and add the spices (turmeric, soup powder and cardamom).'),
('lior', 3, 3, 'Make round patties the size of a tennis ball from the meat mixture, and throw them into the soup.'),
('lior', 3, 4, 'Let the meatballs cook for about half an hour.');



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









