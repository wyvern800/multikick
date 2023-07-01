import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import rootReducer from './reducers'; // your root reducer

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store =  configureStore({
  reducer: persistedReducer, // Make sure persistedReducer is passed here
});

export const persistor = persistStore(store);