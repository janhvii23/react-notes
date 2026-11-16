
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("myNotes") || "[]");
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("myNotes", JSON.stringify(notes));
  }, [notes]);

  function saveNote(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId !== null) {
      setNotes(notes.map(note =>
        note.id === editingId
          ? { ...note, title, content }
          : note
      ));
      setEditingId(null);
    } else {
      setNotes([
        ...notes,
        { id: Date.now(), title, content }
      ]);
    }

    setTitle("");
    setContent("");
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  }

  function deleteNote(id) {
    setNotes(notes.filter(note => note.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setContent("");
    }
  }

  return (
    <div className="app">
      <header>
        <h1>My Notes Manager</h1>
        <p>Create, edit and organize your notes</p>
      </header>

      <form className="note-form" onSubmit={saveNote}>
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="4"
        />
        <button type="submit">
          {editingId !== null ? "Update Note" : "Add Note"}
        </button>
        {editingId !== null && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <section className="notes-section">
        <h2>Your Notes ({notes.length})</h2>

        {notes.length === 0 ? (
          <p className="empty">No notes yet. Add your first note!</p>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <article className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="actions">
                  <button onClick={() => editNote(note)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
