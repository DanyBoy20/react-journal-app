/*
 El state estara vacio cuando no estemos autenticados
 {
   uid: 'jhfjhflfhguygyut7o6u'
   name: 'Daniel'
 }
*/
import { types } from "../types/types";

export const authReducer = (state = {}, action) =>{

  switch(action.type){

    case types.login:
      return{
        uid: action.payload.uid,
        name: action.payload.displayName
      }
    case types.logout:
      return{}
    default:
      return state;   
  }

}