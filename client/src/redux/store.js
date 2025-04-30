import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage' 

const rootReducer= combineReducers({
  user:userReducer,
});

const persistConfig = {
  key:'root',
  storage,
  version:1,
};

const persistedReducer= persistReducer(persistConfig,rootReducer);

export const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  ) //middleware to prevent error
})

export const persistor = persistStore(store); //this is going to persist the store