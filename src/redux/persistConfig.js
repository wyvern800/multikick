import storage from 'redux-persist/lib/storage'; // or choose your storage engine

const persistConfig = {
  key: 'root', // key for the root of your Redux store
  storage, // storage engine to use
};

export default persistConfig;