'use strict';
// eslint-disable-next-line no-undef
const prompt = require('prompt-sync')();
// eslint-disable-next-line no-undef
const cakeRecipes = require('./cake-recipes.json');

// Your functions here

const savedRecipes = [];

// Returns al list of values from a given key
function listValues(listOfRecipes, propertyName) {
  const values = [];
  listOfRecipes.forEach((recipe) => {
    const value = recipe[propertyName];
    if (!value) return; // sla "", 0, false, null, undefined over (met hulp van Claude)
    if (!values.includes(value)) values.push(value);
  });
  return values;
}

// Returns names of recipes from a list
function listRecipesNames(listOfRecipes) {
  const recipesNames = [];
  listOfRecipes.forEach((recipe) => {
    // Get recipe by object destructuring
    const { Name } = recipe;
    if (!Name) return;
    if (!recipesNames.includes(Name)) recipesNames.push(Name);
  });
  return recipesNames;
}

// Returns a list of names of recipes of a given author
function listAuthorsRecipesNames(listOfRecipes, author) {
  const authorsRecipes = listOfRecipes.filter(({ Author }) => {
    if (!Author) return false;
    return Author.toLowerCase() === author.toLowerCase();
  });
  const listOfAuthorsRecipesNames = listRecipesNames(authorsRecipes);
  return listOfAuthorsRecipesNames;
}

// Returns a list of names of recipes that contain a given ingredient
// The some method with help from Claude
function listIngredientsRecipesNames(listOfRecipes, ingredient) {
  const ingredientsRecipes = listOfRecipes.filter((recipe) => {
    if (!recipe.Ingredients) return false;
    return recipe.Ingredients.some((i) => {
      if (!i) return false;
      return i.toLowerCase().includes(ingredient.toLowerCase());
    });
  });
  return listRecipesNames(ingredientsRecipes);
}

// Prints a single recipe that matches the given name
function printSelectedRecipe(listOfRecipes, selectedRecipe) {
  const selected = listOfRecipes.find((recipe) => {
    const { Name } = recipe;
    if (!Name) return false;
    return Name.toLowerCase().includes(selectedRecipe.toLowerCase());
  });
  if (!selected) {
    console.log(
      `${selectedRecipe} is not a valid input. Check spelling and try again.`,
    );
    // Met hulp van Claude
    return null;
  }
  return printRecipe(selected);
}

// Prints the ingredients of every recipe whose name is in the given list
function listIngredients(listOfRecipes, list) {
  let found = false;
  listOfRecipes.forEach((recipe) => {
    const { Name, Ingredients } = recipe;
    if (!Name || !Ingredients) return;
    if (list.includes(Name)) {
      logIngredients(Name, Ingredients);
      found = true;
    }
  });
  if (!found) console.log('No results.');
}

// Prints the ingredients of a single recipe
function logIngredients(recipeName, ingredientsList) {
  console.log(`Ingredients for ${recipeName}:`);
  ingredientsList.forEach((ingredient) => console.log(`- ${ingredient}`));
  console.log('\n');
}

// Prints items in list alphabetically
function logListAlphabetically(list) {
  if (list.length > 0) {
    list.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) return -1;
      if (a.toLowerCase() > b.toLowerCase()) return 1;
      return 0;
    });
    list.forEach((item) => console.log(`- ${item}`));
  } else console.log(`No items found.`);
}

// Prints complete recipes
function printRecipe(recipe) {
  console.log(`Name: ${recipe.Name}`);
  console.log(`Description: ${recipe.Description}`);
  console.log(`Author: ${recipe.Author} \n`);
  console.log(`Method: ${recipe.Method} \n`);
  console.log(`Ingredients:`);
  recipe.Ingredients.forEach((ingredient) => console.log(`- ${ingredient}`));
  const saveToList = prompt('\nDo you want to save this recipe? y/n: ');
  if (!saveToList || (saveToList !== 'y' && saveToList !== 'n')) {
    console.log("Your input should be 'y' or 'n'.");
    return;
  }
  if (saveToList === 'n') {
    console.log(`The recipe "${recipe.Name}" won't be saved.`);
    return;
  }
  savedRecipes.push(recipe.Name);
  console.log(`The recipe "${recipe.Name}" is saved.`);
}

// Part 2

const displayMenu = () => {
  console.log('\nRecipe Management System Menu:');
  console.log('1. Show All Authors');
  console.log('2. Show Recipe names by Author');
  console.log('3. Show Recipe names by Ingredient');
  console.log('4. Get Recipe by Name');
  console.log('5. Get All Ingredients of Saved Recipes');
  console.log('0. Exit');
  const choice = prompt('Enter a number (1-5) or 0 to exit: ');
  return parseInt(choice);
};

let choice;

do {
  choice = displayMenu();

  switch (choice) {
    case 1:
      logListAlphabetically(listValues(cakeRecipes, 'Author'));
      break;
    case 2: {
      // {} met hulp van Claude => er is geen block scope per case, tenzij je zelf {} toevoegt
      const author = prompt(
        'Enter the author name whose recipes you want to list: ',
      );
      logListAlphabetically(listAuthorsRecipesNames(cakeRecipes, author));
      break;
    }
    case 3: {
      const ingredient = prompt(
        'Enter the ingredient of recipes you want to list: ',
      );
      logListAlphabetically(
        listIngredientsRecipesNames(cakeRecipes, ingredient),
      );
      break;
    }
    case 4: {
      const recipe = prompt('Enter the recipe you want to see: ');
      printSelectedRecipe(cakeRecipes, recipe);
      break;
    }
    case 5: {
      listIngredients(cakeRecipes, savedRecipes);
      break;
    }
    case 0:
      console.log('Exiting...');
      break;
    default:
      console.log('Invalid input. Please enter a number between 0 and 5.');
  }
} while (choice !== 0);
