import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  accessToken: {
    type: String,
    required: true,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
})

const User = mongoose.model("User", userSchema);

export default User;
