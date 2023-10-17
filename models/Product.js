import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Category'
    }
  ],
  cardImage: {
    type: String,
    required: true,
  },
  images: [{
    type: String
  }],
  country: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  usage: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  yearCreated: {
    type: Number,
    default: "",
  },
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  hasDiscount: {
    type: Boolean,
    default: false, // Default value is false (no discount)
  },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);