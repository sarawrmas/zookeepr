const router = require("express").Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require("../../lib/animals");
const { animals } = require("../../data/animals");

// creates route that the front-end can request data from using get() method with two arguments:
// 1. req - string that describes the route the client will have to fetch from
// 2. res - (response) callback function that executes every time the route is accessed with a GET request
router.get("/animals", (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//  returns one specific animal rather than an array of animals that match the query
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// Accepts data to be used or stored server-side
router.post('/animals', (req, res) => {
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

module.exports = router;