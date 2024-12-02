import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  LikedMovies: {
    type: Array,
  },
});

const UserModel = mongoose.model("UserModel", UserSchema);

export default UserModel;
