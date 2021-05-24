const express = require('express');
// tell our app to use an environment variable
const PORT = process.env.PORT || 3001;
// instantiate the server to start Express.js, assigning express() to the app variable
const app = express();
// require data to connect front-end to back-end
const { animals } = require('./data/animals');

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

// creates route that the front-end can request data from using get() method with two arguments:
// 1. req - string that describes the route the client will have to fetch from
// 2. res - (response) callback function that executes every time the route is accessed with a GET request
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//  returns one specific animal rather than an array of animals that match the query
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// make server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});