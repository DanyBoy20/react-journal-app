import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { JournalScreen } from "../components/journal/JournalScreen";
import { AuthRouter } from "./AuthRouter";
import { firebase } from "../firebase/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { startLoadingNotes } from "../actions/notes";

export const AppRouter = () => {

  const dispatch = useDispatch();

  // checar si el usuario esta logueado y mandarlo a alguna ruta (pagina en el router)
  const [ checking, setChecking ] = useState(true);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  useEffect(() => {
    // se crea un observable para checar cuando la autenticacion cambia
    // onAuthStateChange auth firebase es una funcion que se ejecuta cuando user cambia
    // cuando el estado de la autenticacioncambia, se ejecuta la funcion
    firebase.auth().onAuthStateChanged( async (user) => {
      /* console.log(user); info del usuario> uid, email, etc... */
      // Si existe el uid del usuario - el signo de interrogacion pregunta si el
      // objeto user tiene algo, si es asi, se evalua la existencia de uid, si es null, salimos
      if( user?.uid){
        dispatch(login(user.uid, user.displayName));
        setIsLoggedIn(true);
        
        dispatch(startLoadingNotes(user.uid));
      }else{
        setIsLoggedIn(false);
      }

      setChecking(false);
    });
    
  }, [ dispatch, setChecking, setIsLoggedIn ])
  
  if(checking){
    return (
      <h1>Wait...</h1>
    )
  }

  return (    
    <Router>
      <div>
        <Routes>
          <Route 
            path="/*" 
            element={
              <PublicRoute isAuth={isLoggedIn}>
                <AuthRouter />
              </PublicRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <PrivateRoute isAuth={isLoggedIn}>
                <JournalScreen />
              </PrivateRoute>
            } 
          />          
        </Routes>
      </div>
    </Router>    
  )
}
