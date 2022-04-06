import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { authReducer } from "../reducers/authReducers";
import thunk from 'redux-thunk';
import { uiReducer } from "../reducers/uiReducer";
import { notesReducers } from "../reducers/notesReducers";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notes: notesReducers
});

export const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);
