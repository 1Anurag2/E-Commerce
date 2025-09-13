import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/products/productSlice'
import userReducer from '../features/user/userSlice' 
const store = configureStore({
  reducer: {
    product:productReducer,
    user:userReducer
  },
});

export default store;