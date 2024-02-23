import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productColecction = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

productSchema.plugin(mongoosePaginate);
export default model(productColecction, productSchema);
