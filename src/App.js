import React, { useState, useEffect } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ThemeToggle from "./components/ThemeToggle";

const firebaseConfig = {
  apiKey: "AIzaSyCZ5RK_BVc7nIYKbpugMb-xJ059cffFLp0",
  authDomain: "notes-eb8df.firebaseapp.com",
  projectId: "notes-eb8df",
  storageBucket: "notes-eb8df.appspot.com",
  messagingSenderId: "573088404098",
  appId: "1:573088404098:web:0a1cc74b13b1a90aa91a9b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [notes, setNotes] = useState([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
    fetchNotes();
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function fetchNotes() {
    try {
      const snapshot = await getDocs(collection(db, "notes"));
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  }

  async function addNote() {
    await addDoc(collection(db, "notes"), { title, content });
    setShowAddNoteModal(false);
    fetchNotes();
  }

  async function saveNoteChanges() {
    await updateDoc(doc(db, "notes", selectedNote.id), { title, content });
    setSelectedNote(null);
    setShowAddNoteModal(false);
    fetchNotes();
  }

  async function deleteNote() {
    await deleteDoc(doc(db, "notes", noteToDelete.id));
    setShowDeleteConfirmation(false);
    fetchNotes();
  }

  function confirmDeleteNote(note) {
    setShowDeleteConfirmation(true);
    setNoteToDelete(note);
  }

  function handleAddNoteButtonClick() {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setShowAddNoteModal(true);
  }

  function handleNoteClick(note, event) {
    if (event.target.classList.contains("delete-icon")) {
      return;
    }
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowAddNoteModal(true);
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Take Notes</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {filteredNotes.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 text-center text-2xl font-bold">
            No notes found.
          </p>
        </div>
      )}

      <NoteList
        notes={filteredNotes}
        theme={theme}
        handleNoteClick={handleNoteClick}
        confirmDeleteNote={confirmDeleteNote}
      />

      {(selectedNote || showAddNoteModal) && (
        <NoteEditor
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          theme={theme}
          saveNoteChanges={saveNoteChanges}
          addNote={addNote}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          setShowAddNoteModal={setShowAddNoteModal}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          deleteNote={deleteNote}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
        />
      )}

      <button
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-md"
        onClick={handleAddNoteButtonClick}
      >
        Add Note
      </button>
    </div>
  );
}

export default App;
