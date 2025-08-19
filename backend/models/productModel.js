import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please enter product category"],
  },

  description: {
    type: String,
    required: [true, "Please enter product description"],
  },

  price: {
    type: Number,
    required: [true, "Please enter product price"],
    Maxlength: [8, "Price cannot exceed 8 digits"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    Maxlength: [5, "Stock cannot exceed 5 digits"],
    default: 1,
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    required: true,
    default: 0,
  },
    reviews: [
        {
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Product", productSchema);
