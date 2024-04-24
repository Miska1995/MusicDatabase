// app.js
// Import the express library to create our server
const express = require('express');

// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Import the Song model from the songModel file located in the models directory
const Song = require('./models/songModel');

// Initialize the express application
const app = express();

// Set the port number the server will listen on
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
// Directly using MongoDB Atlas connection string
mongoose.connect('mongodb+srv://miskatevilin:Miska1995@musiccluster.oo4n8gh.mongodb.net/?retryWrites=true&w=majority&appName=MusicCluster', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve static files from 'public' directory
app.use(express.static('public'));

// GET all songs with optional generalized search
app.get('/api/songs', async (req, res) => {
    const search = req.query.search;
    let searchCriteria = {};

    if (search) {
        // A case-insensitive regex search across multiple fields
        const regex = { $regex: search, $options: 'i' };
        searchCriteria = {
            $or: [
                { title: regex },
                { artist: regex },
                { genre: regex }
            ]
        };
    }

    try {
        const songs = await Song.find(searchCriteria);
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET a specific song by ID
app.get('/api/songs/:id', async (req, res) => {
try {
    const song = await Song.findById(req.params.id);
    if (!song) {
    return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

// POST a new song
app.post('/api/songs', async (req, res) => {
const song = new Song(req.body);
try {
    const savedSong = await song.save();
    res.status(201).json(savedSong);
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

// PUT update a song by ID
app.put('/api/songs/:id', async (req, res) => {
try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) {
    return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

// DELETE a song by ID
app.delete('/api/songs/:id', async (req, res) => {
    try {
    const result = await Song.findByIdAndDelete(req.params.id);
    if (!result) {
        return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted' });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});


// Start the server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});
