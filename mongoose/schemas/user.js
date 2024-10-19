import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  hashedPassword: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
});
export const User = mongoose.model("User", UserSchema);
