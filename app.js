const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');
const mainScrapper  = require('./lib/nike-scrapper.js');


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});


app.post('/', async (req, res) => {
    const userInput = req.body;
    console.log("userInput: ", userInput);
    const {email, password, cv, size, url} = userInput;



    await mainScrapper(email, password, cv, size, url);


});
app.listen(3000, () => {
            console.log('connected to website, app listening on port 3000')
        });




