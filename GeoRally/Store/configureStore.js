import { createStore } from 'redux';
import connectionReducer from "./Reducers/connectionReducer";
import circuitsReducer from "./Reducers/circuitsReducer";
import offlineReducer from "./Reducers/offlineReducer";
import {persistCombineReducers} from "redux-persist";
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
    key: 'root',
    storage: storage
  }
  
  export default createStore(persistCombineReducers(rootPersistConfig, {connectionReducer, circuitsReducer, offlineReducer}))