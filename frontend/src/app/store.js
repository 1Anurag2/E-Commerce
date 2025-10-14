import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/products/productSlice'
import userReducer from '../features/user/userSlice' 
import cartReducer from '../features/cart/cartSlice'
const store = configureStore({
  reducer: {
    product:productReducer,
    user:userReducer,
    cart:cartReducer,
  },
});

export default store;