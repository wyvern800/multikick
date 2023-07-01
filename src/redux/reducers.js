import { combineReducers } from '@reduxjs/toolkit';

import appReducer from './impl/appReducer';

const rootReducer = combineReducers({
  app: appReducer,
  // Add other reducers here if you have more
});

export default rootReducer;