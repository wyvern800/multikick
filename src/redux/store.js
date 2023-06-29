import { configureStore } from '@reduxjs/toolkit';
import appSlice from './impl/appSlice';

export default configureStore({
  reducer: {
    app: appSlice
  },
})