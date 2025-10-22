import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// creating Order
export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
  try {
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
    const { data } = await axios.post('/api/v1/order/new', order, config);
    if (data.success) {
      return data.order;
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Order Creating Failed');
  }
});

// Get User Orders
export const getAllMyOrders = createAsyncThunk('order/getUserOrders', async (_, { rejectWithValue }) => {
  try {
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
    const { data } = await axios.get('/api/v1/orders/user', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch orders');
  }
});

// Get order Details
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/order/${orderId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch order details');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    error: null,
    success: false,
    orders: [],
    order: {},
  },
  reducers: {
      removeErrors:(state) => {
          state.error = null;
      },
      removeSuccess:(state) => {
          state.success = false;
      }
  }
,
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Order Creating Failed';
        state.success = false;
      });

      // Get User Orders
    builder
      .addCase(getAllMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.orders = action.payload.orders;
      })
      .addCase(getAllMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
        state.success = false;
      }); 
      
      // Get Order Details
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order details';
        state.success = false;
      });
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer; 