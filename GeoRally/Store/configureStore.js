import { createStore } from 'redux';
import connectionReducer from "./Reducers/connectionReducer";
import {persistCombineReducers} from "redux-persist";
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
    key: 'root',
    storage: storage
  }
  
  export default createStore(persistCombineReducers(rootPersistConfig, {connectionReducer}))