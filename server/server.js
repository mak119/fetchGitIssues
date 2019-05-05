const express = require('express');
const cors = require('cors');
const path = require('path');

// assigning variable to this method
const app = express();

// using this middleware to handle cross origin errors
app.use(cors());
// handling the static files which are created when dist directory is created that is on build.
// __dirname is equivalent to current directory 
app.use(express.static(path.join(__dirname, '../client/dist/fetchgitissues/')));

// redirecting all the requests to our index.html file
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../client/dist/fetchgitissues/', 'index.html'));
});

// starting server on either the port specified by environment or port 3000
app.listen(process.env.PORT || 3000, () => {
    console.log('server started...');
})

