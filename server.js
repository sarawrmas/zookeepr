const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const express = require('express');
// tell our app to use an environment variable
const PORT = process.env.PORT || 3001;
// instantiate the server to start Express.js, assigning express() to the app variable
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// instructs the server to make front-end files readily available and not gate it behind a server endpoint
app.use(express.static('public'));
// any time a client navigates to <host>/api, the app will use the router set up in apiRoutes
app.use('/api', apiRoutes);
// if / is the endpoint, the router will serve back the HTML routes
app.use('/', htmlRoutes);

// make server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});