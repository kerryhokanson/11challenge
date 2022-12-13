const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const {v4: uuidv4} = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
); 

app.get('/api/notes', (req, res) => {
const notesObject = fs.readFileSync("./db/db.json", 'utf8');
res.send(notesObject);
});

app.post('/api/notes', (req, res) => {
  const newNote = {...req.body, id: uuidv4()};
  // const newNoteObj = JSON.parse(newNote)
  var notesArrayString = fs.readFileSync("./db/db.json", 'utf8');
  const notesArrayObject = JSON.parse(notesArrayString);
  // console.log(notesArrayObject)
  notesArrayObject.push(newNote);
  // console.log(notesArrayObject)

  notesArrayString = JSON.stringify(notesArrayObject);
  // console.log(notesArrayString)

  fs.writeFile('./db/db.json', notesArrayString,(err) => {
    if(err) {
      console.log(err)
    }
  });


  res.send(notesArrayString);
});


// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

