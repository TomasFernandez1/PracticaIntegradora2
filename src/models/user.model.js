import { Schema, model } from "mongoose";

const userColecction = "users";
const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
});

export default model(userColecction, userSchema);
