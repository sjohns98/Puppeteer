const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const collection = "user";
const mainScrapper  = require('./lib/nike-scrapper.js');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});
app.get('/getUser', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            consolee.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});

app.delete('/:id', (req, res) => {
    const userID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(userID) }, (err, result) => {

        if (err)
            console.log(err);
        else
            res.json(result);
    })
})


app.put('/:id', async (req, res) => {
    const userID = req.params.id;
    const userInput = req.body;
    
    



    



    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(userID) }, { $set: { user: userInput.user } }, { returnOriginal: false }, (err, result) => {

        if (err)
            console.log(err)
        else
            res.json(result);m

    });
});

app.post('/', async (req, res) => {
    const userInput = req.body;
    console.log("userInput: ", userInput);
    const {email, password, cv, size} = userInput;



    await mainScrapper(email, password, cv, size);

    db.getDB().collection(collection).insertOne(userInput, (err, result) => {

        // console.log(result);

        
        if (err)
            console.log(err);

        else
            res.json({ result: result, document: result.ops[0] });

    });
});




db.connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('connected to db, app listening on port 3000')
        });

    }
})

