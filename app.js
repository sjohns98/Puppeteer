const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');
const mainScrapper  = require('./lib/new-scrapper.js');
var port_number = app.listen(process.env.PORT || 3000);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});


app.post('/', async (req, res) => {
    const userInput = req.body;
    console.log("userInput: ", userInput);
    const {email, password, cv, size, url} = userInput;
    await mainScrapper(email, password, cv, size, url);
});
app.listen(port_number);





