import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";

function NoteList({ notes, theme, handleNoteClick, confirmDeleteNote }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <div key={index} className="card relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <FontAwesomeIcon
              icon={faTimes}
              className="delete-icon text-red-500 hover:text-red-600 cursor-pointer"
              onClick={() => confirmDeleteNote(note)}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <div
              className={`text-gray-700 truncate text-lg ${
                theme === "dark" && "text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: note.content }}
            ></div>
          </div>
          <div className="absolute bottom-2 right-2">
            <FontAwesomeIcon
              icon={faEdit}
              className="edit-icon text-blue-500 hover:text-blue-600 cursor-pointer"
              onClick={(event) => handleNoteClick(note, event)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
