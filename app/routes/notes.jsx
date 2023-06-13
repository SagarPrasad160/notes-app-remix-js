import { redirect, json } from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import { getStoredNotes, storeNotes } from "~/data/notes";

import {
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import NoteList, { links as noteListLinks } from "../components/NoteList";

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes!" },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return { message: "Title must be atleast 5 characters long!" };
  }
  noteData.id = new Date().toISOString();
  const exisitingNotes = await getStoredNotes();
  const updatedNotes = exisitingNotes.concat(noteData);
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export function ErrorBoundary() {
  const error = useRouteError();
  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <NewNote />
        <p className="info-message">Status: {error.status}</p>
        <p className="info-message">{error.data.message}</p>
      </main>
    );
  }

  // error boundary
  return (
    <main className="error">
      <h1>An Error Occured in Notes Page.</h1>
      <p>{error.message}</p>
    </main>
  );
}
