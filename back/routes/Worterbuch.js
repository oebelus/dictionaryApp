const express = require('express');
const router = express.Router();
const { Words } = require('../models');

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const listOfWords = await Words.findAll({ where: { humanId: userId } }); // Use humanId to filter by userId
        res.json(listOfWords);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});

router.post("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Access userId from the route parameter
        const { word, meaning } = req.body;
        console.log("Received userId:", userId); // Log userId
        console.log("Received data:", req.body);
        console.log("ID BACK: ", userId);

        if (!word || !meaning) {
            return res.status(400).json({ error: "Word and meaning are required" });
        }

        // Create a new word associated with the user (humanId)
        const newWord = await Words.create({ humanId: userId, word, meaning });

        res.status(201).json(newWord);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});


router.delete("/:userId/:id", async (req, res) => {
    try {
        const userId = req.params.userId; // Access userId from the route parameter
        const wordId = req.params.id;
        /* Pk: Primary Key */
        const wordToDelete = await Words.findByPk(wordId);

        if (!wordToDelete) {
            return res.status(404).json({ error: 'Word not found' });
        }

        await wordToDelete.destroy();
        res.status(204).send(); // Send a success response with no content
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

router.put("/:userId/:id", async (req, res) => {
    try {
        const userId = req.params.userId; // Access userId from the route parameter
        const wordId = req.params.id;
        const updatedWord = req.body; // Data to update, including 'word' and 'meaning'
  
        // Find the word to update by its ID
        const wordToUpdate = await Words.findByPk(wordId);
  
        if (!wordToUpdate) {
            return res.status(404).json({ error: 'Word not found' });
        }
  
        // Update the word's properties
        wordToUpdate.word = updatedWord.word;
        wordToUpdate.meaning = updatedWord.meaning;
  
        // Save the changes to the database
        await wordToUpdate.save();
  
        res.json(wordToUpdate); // Return the updated word
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
