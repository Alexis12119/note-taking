import express, { json } from 'express';
import { connect, connection as _connection, Schema, model } from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// MongoDB Connection
const uri = 'mongodb+srv://corporalalexis222:o9davrUFPT6DZerm@notes.35amelr.mongodb.net/?retryWrites=true&w=majority&appName=notes';
connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = _connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Schema and Model
const noteSchema = new Schema({
  title: String,
  content: String,
});

const Note = model('Note', noteSchema);

// Routes
app.get('/notes', async (_req, res) => {
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
