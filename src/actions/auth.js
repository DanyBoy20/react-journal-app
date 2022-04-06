import { types} from '../types/types';
import Swal from 'sweetalert2';
import { firebase, googleAuthProvider } from '../firebase/firebase-config';
import { finishLoading, startLoading } from './ui';
import { noteLogout } from './notes';

// acción asincrona que se ejecuta cuando el usuario se loguea, por lo que retornamos un callbak y el dispatch
export const startLoginEmailPassword = (email, password) => {
  return (dispatch) => {

    // startLoading para cambiar a true el loading
    dispatch( startLoading() );
    // autenticamos al usuario
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( ({user}) => { // usuario valido
      dispatch(login(user.uid, user.displayName));
      // terminamos el loading
      dispatch(finishLoading());

    })
    // usuario invalido
    .catch(e => {
      /* console.log(e); */
      dispatch(finishLoading());
      Swal.fire('Error', e.message, 'error');
    });
    
  }
  
}

export const startRegisterWithEmailPasswordName = (email, password, name) => {
  return (dispatch) => {
    // creamos usuario con firebase ( y su metodo createUserWith...)
    // esta funcion de firebase, tambien autentica con los datos que le pasamos
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( async ({ user }) => {
        // firebase no crea el nombre, pero si le tenemos un parametro, podemos actuaizar el usuario y asignarle nombre
        await user.updateProfile({displayName: name});
        /* console.log(user) */
        dispatch(
          login( user.uid, user.displayName)
        )
      })
      .catch ( e => {
        /* console.log(e); */
        Swal.fire('Error', e.message, 'error'); 
      })
  }
}


export const startGoogleLogin = () => {
  return ( dispatch ) => {
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then( ({ user }) => {
        dispatch(
          login(user.uid, user.displayName)
        )
      })
  }  
}

export const login = (uid, displayName) => ({
  type: types.login,
  payload: {
    uid, displayName
  }  
});

// empezar el cierre de sesion
// tiene que ser asincrona por que necesitamos disparar 
// la accion de firebase y ejecutar el logout que regresa una promesa
export const startLogOut = () => {
  return async (dispatch) => {
    await firebase.auth().signOut(); // podemos agregar then y catch
    // la accion que eliminara el id y username del store
    dispatch( logout() ); 
    dispatch( noteLogout() );
  }
};

export const logout = () => ({
  type: types.logout
});