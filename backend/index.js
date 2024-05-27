const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://corporalalexis222:o9davrUFPT6DZerm@notes.35amelr.mongodb.net/?retryWrites=true&w=majority&appName=notes';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Schema and Model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.post('/notes/add', async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await newNote.save();
    res.json('Note added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
