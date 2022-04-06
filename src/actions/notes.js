import Swal from "sweetalert2";
import { db } from "../firebase/firebase-config";
import { fileUpload } from "../helpers/fileUpload";
import { loadNotes } from "../helpers/loadNotes";
import { types } from "../types/types";

// react-journal

// es asincrona (por que firebase retorna promesas)
// por lo que usamos dispatch (think)
export const startNewNote = () => {

  return async ( dispatch, getState ) => {
    // obtenemos el estado del reducer authy propiedad uid
    // es lo mismo que: const {uid} = getState().auth;
    const uid = getState().auth.uid;
    // objeto para la nota
    const newNote = {
      title: '',
      body: '',
      date: new Date().getTime()
    }
    // creamos una referencia a la coleccion notes
    const doc = await db.collection(`${ uid }/journal/notes`).add( newNote);

    dispatch( activeNote( doc.id, newNote));

    dispatch(addnewNote(doc.id,newNote));

  }
}

export const activeNote = (id, note) => ({
  type: types.notesActive,
  payload: {
    id,
    ...note // el objeto de notesReducers (y todossus campos)
  }
});

export const startLoadingNotes = ( uid ) => {
  return async (dispatch) => {
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  }
}

export const addnewNote = (id, note) => ({
  type: types.notesAddNew,
  payload: {
    id,
    ...note
  }
})

export const setNotes = (notes) => ({
  type: types.notesLoad,
  payload: notes
});

export const startSaveNote = ( note ) => {
  return async ( dispatch, getState ) => {

    const { uid } = getState().auth;  
    if( !note.url ){
      delete note.url;
    }
    const noteToFirestore = { ...note };
    // como en firebase el id no es parte de la nota misma
    // (el id es la referencia), entonces eliminamos
    // ese id para tener solo los datos de la nota
    // a insertar en firebase
    delete noteToFirestore.id;

    await db.doc(`${uid}/journal/notes/${note.id}`).update(noteToFirestore);

    dispatch( refreshNote( note.id, noteToFirestore ) );

    Swal.fire('Saved', note.title, 'success');


  }
}

export const refreshNote = ( id, note ) => ({
  type: types.notesUpdated,
  payload: {
    id,
    note: {
      id,
      ...note
    }
  }
});

export const startUploading = ( file ) => {
  return async (dispatch, getState) => {

    const { active: activeNote } = getState().notes;

    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    /* console.log(activeNote);
    console.log(file); */

    const fileUrl = await fileUpload( file );
    activeNote.url = fileUrl;

    dispatch( startSaveNote ( activeNote ) );

    /* console.log(fileUrl); */

    Swal.close();

  }
}

export const startDeleting = ( id ) => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid;
    await db.doc(`${ uid }/journal/notes/${ id }`).delete();
    dispatch( deleteNote(id));
  }
}

export const deleteNote = (id) => ({
  type: types.notesDelete,
  payload: id
});

export const noteLogout = () => ({
  type: types.notesLogOutCleaning
})