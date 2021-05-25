const fs = require('fs');
const path = require('path');
const express = require('express');
// tell our app to use an environment variable
const PORT = process.env.PORT || 3001;
// instantiate the server to start Express.js, assigning express() to the app variable
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// require data to connect front-end to back-end
const { animals } = require('./data/animals');
// instructs the server to make front-end files readily available and not gate it behind a server endpoint
app.use(express.static('public'));

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
        path.join(__dirname, './data/animals.json'),
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

// Accepts data to be used or stored server-side
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array
        const animal = createNewAnimal(req.body, animals);
        // send data back to the client
        res.json(animal);
    }
});

// connect html to back-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});
// use wildcard route so that if a user tries to navigate anywhere besides given routes, they are rerouted to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// make server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});