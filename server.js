var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./db/db.json");
var { v4: uuidv4 } = require("uuid");


// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", 'utf8', function (err, data) {
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", function (req, res) {
    var title = req.body.title;
    var text = req.body.text;
    var newNote = { title, text, id: uuidv4() };
    fs.readFile("./db/db.json", function (err, data) {
        var currentNotes = JSON.parse(data);
        currentNotes.push(newNote);
        fs.writeFile("./db/db.json", [JSON.stringify(currentNotes)], function (err) {
            console.log(newNote)
        })
        res.sendFile(path.join(__dirname, "/db/db.json"));
    })

});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});