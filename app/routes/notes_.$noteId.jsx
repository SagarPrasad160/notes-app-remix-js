import styles from "~/styles/notes-details.css";

import { Link, useLoaderData } from "@remix-run/react";

import { getStoredNotes } from "~/data/notes";
import { json } from "@remix-run/node";

export default function NoteDetails() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          {" "}
          <Link to="/notes">Back to all notes</Link>{" "}
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}
let notes;
export async function loader({ params }) {
  const noteId = params.noteId;
  notes = await getStoredNotes();
  const noteData = notes.find((note) => note.id === noteId);

  if (!noteData) {
    throw json(
      { message: "Note not found with id " + noteId },
      { status: 404 }
    );
  }
  return noteData;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta({ matches }) {
  const note = matches[1].data;
  return [
    { title: note.title },
    { name: "description", content: "Manage your notes with ease" },
  ];
}
