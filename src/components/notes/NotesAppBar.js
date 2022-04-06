import { useDispatch, useSelector } from "react-redux"
import { startSaveNote, startUploading } from "../../actions/notes";

export const NotesAppBar = () => {

  const {active} = useSelector(state => state.notes);

  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(startSaveNote(active));
  }

  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    if(file){
      dispatch(startUploading(file));
    }

  }

  const handlePictureClick = () => {
    document.querySelector('#fileSelector').click();
  }

  return (
    <div className='notes__appbar'>
      <span>20 de agosto 2022</span>

      <input
        id="fileSelector"
        type="file"
        name="file"
        style={{display: 'none'}}
        onChange={ handleFileChange} 
      />

      <div>
        <button className="btn" onClick={handlePictureClick}>
          Picture
        </button>

        <button className="btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}
