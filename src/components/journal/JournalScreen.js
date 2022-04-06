/* import { NothingSelected } from "./NothingSelected" */
import { useSelector } from "react-redux"
import { NotesScreen } from "../notes/NotesScreen"
import { NothingSelected } from "./NothingSelected"
import { Sidebar } from "./Sidebar"

export const JournalScreen = () => {

  const { active } = useSelector(state => state.notes);

  return (
    <div className="journal__main-content animate__animated animate__fadeIn animate__faster">
      <Sidebar />
      <main>  
        {
          ( active ) 
          ? (<NotesScreen />)
          : (<NothingSelected />)
        }
      </main>
    </div>
  )
}
