const router = require("express").Router();
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require("../../lib/zookeepers");
const { zookeepers } = require("../../data/zookeepers");

// creates route that the front-end can request data from using get() method with two arguments:
// 1. req - string that describes the route the client will have to fetch from
// 2. res - (response) callback function that executes every time the route is accessed with a GET request
router.get("/zookeepers", (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//  returns one specific zookeeper rather than an array of zookeepers that match the query
router.get('/zookeepers/:id', (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// Accepts data to be used or stored server-side
router.post('/zookeepers', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = zookeepers.length.toString();
    // if any data in req.body is incorrect, send 400 error back
    if (!validateZookeeper(req.body)) {
        res.status(400).send('The zookeeper is not properly formatted.');
    } else {
        // add zookeeper to json file and zookeepers array
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        // send data back to the client
        res.json(zookeeper);
    }
});

module.exports = router;