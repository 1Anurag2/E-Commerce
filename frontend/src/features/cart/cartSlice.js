import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add item to cart
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      const productData = data.product || data;

      console.log("Fetched product data:", productData);

      return {
        product: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.images[0].url,
        stock: productData.stock,
        quantity,
      };
    } catch (error) {
      console.error("Cart error:", error.response || error.message);
      return rejectWithValue(error.response?.data?.message || "Server Error");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    message: null,
    success: false,
    removingId:null,
    shippingInfo:JSON.parse(localStorage.getItem("shippingInfo")) || {},
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeItemsFromCart: (state, action) => {
      state.removingId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      state.message = "Item removed from cart successfully";
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.removingId = null;
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
          state.message = `${item.name} quantity updated in cart successfully`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} added to cart successfully`;
        }

        state.loading = false;
        state.error = null;
        state.success = true;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Server Error";
        state.message = null;
        state.success = false;
      });
  },
});

export const { removeErrors, removeMessage ,removeItemsFromCart ,saveShippingInfo} = cartSlice.actions;
export default cartSlice.reducer;
