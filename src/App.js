import React, { useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;
    setNotes([...notes, { title, content }]);
    setTitle("");
    setContent("");
    setShowAddNoteModal(false);
  };

  const confirmDeleteNote = (note) => {
    setShowDeleteConfirmation(true);
    setNoteToDelete(note);
  };

  const deleteNote = () => {
    setNotes(notes.filter((note) => note !== noteToDelete));
    setSelectedNote(null);
    setShowDeleteConfirmation(false);
  };

  const handleAddNoteButtonClick = () => {
    setSelectedNote(null); // Reset selected note
    setTitle(""); // Reset title
    setContent(""); // Reset content
    setShowAddNoteModal(true);
  };
  const handleNoteClick = (note, event) => {
    // Check if the clicked element is the delete button
    if (event.target.classList.contains("delete-button")) {
      return;
    }
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">My Notes</h1>

      <input
        type="text"
        placeholder="Search notes..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {filteredNotes.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-center text-2xl font-bold">
            No notes found.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNotes.map((note, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-lg rounded-md cursor-pointer relative overflow-hidden"
            onClick={(event) => handleNoteClick(note, event)}
          >
            <div>
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-gray-700 truncate">{note.content}</p>
              <br />
              <br />
            </div>
            <div className="absolute bottom-2 right-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 rounded-md delete-button"
                onClick={() => confirmDeleteNote(note)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white p-8 rounded-md shadow-lg max-w-3xl relative border border-gray-300" // Added border style here
            style={{
              minWidth: "400px",
              maxWidth: "600px",
              minHeight: "200px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-2 p-2 border-2 border-solid rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="w-full h-40 mb-2 p-2 border-2 border-solid rounded-md resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
              onClick={() => {
                const updatedNotes = notes.map((noteItem) =>
                  noteItem === selectedNote ? { title, content } : noteItem,
                );
                setNotes(updatedNotes);
                setSelectedNote(null);
              }}
            >
              Save
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
              onClick={() => setSelectedNote(null)}
            >
              Cancel
            </button>
            <button
              className="absolute top-0 right-0 mt-4 mr-4 bg-transparent border-none cursor-pointer"
              onClick={() => setSelectedNote(null)}
            ></button>
          </div>
        </div>
      )}

      {showAddNoteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Add Note</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Content"
              className="w-full h-40 mb-2 p-2 border border-gray-300 rounded-md resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
                onClick={addNote}
              >
                Save
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                onClick={() => setShowAddNoteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-md">
            <p className="text-xl font-semibold mb-4">
              Are you sure you want to delete this note?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
                onClick={deleteNote}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
