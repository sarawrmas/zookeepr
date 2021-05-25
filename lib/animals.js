const fs = require('fs');
const path = require('path');

// takes in req.query as an argument and filters through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    // Set personality traits array to an empty array
    let personalityTraitsArray = [];

    // Save the animalsArray as filteredResults
    let filteredResults = animalsArray;

    // Save personalityTraits as a dedicated array
    if (query.personalityTraits) {
        // If personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    // User searches by diet
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }

    // User searches by species
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }

    // User searches by name
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }

    // function returns results of search
    return filteredResults;
};

// searches for one animal by taking in the id and array of animals and returning a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// accepts the POST route's req.body value and the array we want to add data to, adding a new animal to the catalog
function createNewAnimal(body, animalsArray) {
    const animal = body;
    // save new animal to animal data
    animalsArray.push(animal);
    // write synchronous file
    fs.writeFileSync(
        // write animals.json file to join the directory of the file we execute the code in with the path to the json file
        path.join(__dirname, '../data/animals.json'),
        // save array data as JSON (json.stringify), don't edit any exisiting data (null), and create space between values to make more readable (2)
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}

// make sure user input is submitted correctly and not missing any criteria
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};