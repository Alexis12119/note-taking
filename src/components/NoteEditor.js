import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function NoteEditor({
  title,
  content,
  setTitle,
  setContent,
  theme,
  saveNoteChanges,
  addNote,
  selectedNote,
  setSelectedNote,
  setShowAddNoteModal,
}) {
  const isAddingNote = selectedNote === null;
  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ];
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-8 rounded-md shadow-lg max-w-3xl relative border border-gray-300"
        style={{
          minWidth: "400px",
          maxWidth: "600px",
          minHeight: "200px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {" "}
          {isAddingNote ? "Add" : "Save"} Note
        </h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border-2 border-solid rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          className="tp mb-2"
          theme="snow"
          modules={{ toolbar: toolbarOptions }}
          style={theme === "dark" ? { color: "#fff" } : {}}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md mr-2"
          onClick={isAddingNote ? addNote : saveNoteChanges}
        >
          {isAddingNote ? "Add" : "Save"}
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
          onClick={() => {
            setSelectedNote(null);
            setShowAddNoteModal(false);
          }}
        >
          Cancel
        </button>
        <button
          className="absolute top-0 right-0 mt-4 mr-4 bg-transparent border-none cursor-pointer"
          onClick={addNote}
        ></button>
      </div>
    </div>
  );
}

export default NoteEditor;
