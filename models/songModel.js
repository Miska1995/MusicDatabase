// models/songModel.js

// Importing Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Defining the schema for the Song model
// This schema defines the structure of the Song documents in the MongoDB database
const songSchema = new mongoose.Schema({
    title: String,  // Field for the song title
    artist: String, // Field for the song artist
    album: String,  // Field for the song album
    year: Number,   // Field for the release year of the song
    genre: String,  // Field for the genre of the song
});

// Exporting the Song model with the schema defined above
// This model provides the interface for creating, querying, updating, and deleting records in the songs collection in the database
module.exports = mongoose.model('Song', songSchema);
