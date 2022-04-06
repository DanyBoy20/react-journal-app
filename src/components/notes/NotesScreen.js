import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { activeNote, startDeleting } from "../../actions/notes";
import { useForm } from "../../hooks/useForm";
import { NotesAppBar } from "./NotesAppBar"

export const NotesScreen = () => {

  const {active: note} = useSelector(state => state.notes);
  const dispatch = useDispatch();
  // 01 cuando cambia la nota, necesitamos resetear el estado del formulario
  // en el hook useForm cambiamos el estado del formulario  
  const [ formValues, handleInputChange, reset ] = useForm( note );
  const { body, title, id } = formValues;

  // 03 variable mutable que no redibuja todo elcomponente si cambia
  const activeId = useRef( note.id );

  // ejecutaremos la accion (useEffect) si y solo si el id de la nota es diferente
  useEffect(() => {
    // comparamos la nota activa con la nota que cambio en el useSelector
    // si son diferentes, necesitamos resetear el formulario
    if(note.id !== activeId.current){
      reset( note ); // reseteamos
      activeId.current = note.id; // asignamos el id activo
    }
  }, [note, reset]);

  useEffect(() => {
    dispatch( activeNote( formValues.id, { ...formValues } ) );
  }, [formValues, dispatch]);
  
  const handleDelete = () => {
    dispatch(startDeleting( id ));
  }

  return (
    <div className="notes__main-content">

      <NotesAppBar />

      <div className="notes__content">

        <input
          type="text" 
          value={title}
          name="title"
          onChange={handleInputChange}
          placeholder="Some awesome title"
          className="notes__title-input"
          autoComplete="off"
        />
        <textarea
          value={body}
          name="body"
          onChange={handleInputChange}
          placeholder="What happened today?"
          className="notes__textarea"
        >
        </textarea>

        {
          (note.url) &&
          (
            <div className="notes__image">
              <img 
                src={note.url} alt="imagen"
              />
            </div>
          )
        }

      </div>    

      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button> 
      
    </div>
  )
}
