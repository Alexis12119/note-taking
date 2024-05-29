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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ColorRing } from "react-loader-spinner";

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
  const [loading, setLoading] = useState(true); // Add loading state
  const spinnerColors = theme === "dark"
    ? ["#ffffff", "#cccccc", "#aaaaaa", "#888888", "#666666"]
    : ["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"];

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
      setLoading(false); // Set loading to false once notes are fetched
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function fetchNotes() {
    try {
      setLoading(true); // Set loading to true when fetching notes
      const snapshot = await getDocs(collection(db, "notes"));
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
      setLoading(false); // Set loading to false once notes are fetched
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
    <div className="container mx-auto p-4 mb-20">
      <div className="fixed top-0 left-0 w-full bg-white z-10 shadow-md">
        <div className="flex justify-between items-center py-2 px-4">
          <h1 className="text-3xl font-semibold">Take Notes</h1>
          <div className="flex items-center">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <input
              type="text"
              placeholder="Search notes..."
              className="ml-2 w-60 p-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-md"
              onClick={handleAddNoteButtonClick}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
      {/* I added this */}
      <input
        type="text"
        placeholder="Search notes..."
        className="ml-2 w-60 p-2 border border-gray-300 rounded-md"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={spinnerColors}
            />
          </div>
        ) : (
          <>
            {filteredNotes.length > 0 ? (
              <NoteList
                notes={filteredNotes}
                theme={theme}
                handleNoteClick={handleNoteClick}
                confirmDeleteNote={confirmDeleteNote}
              />
            ) : (
              <div className="text-3xl text-center text-gray-500 font-semibold mt-24">
                No notes found
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}

export default App;
