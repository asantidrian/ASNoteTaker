
const noteRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
noteRouter.get('/notes', (req, res) => {
    readFromFile('./db/db.json')
        .then((data) => {
            res.json(JSON.parse(data))
            console.log("1" + req.body)

        })
})
// // POST Route for a new note 
noteRouter.post('/notes', (req, res) => {
    console.log("2" + req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding note');
    }
});

// GET Route for a specific note
noteRouter.get('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((notes) => notes.note_id === noteId);
            return result.length > 0
                ? res.json(result)
                : res.json('No note with that ID');
        });
});

// DELETE Route for a specific note 
noteRouter.delete('/notes/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    console.log(req.params.note_id)
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const result = json.filter((notes) => notes.note_id !== noteId);
            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});
module.exports = noteRouter;
