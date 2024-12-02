import express from "express";
import {
  handleAddUserLikedMovie,
  handleGetUserLikedMovie,
  handleRemoveUserLikedMovie,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/addlikedlist", handleAddUserLikedMovie);
router.get("/getlikedlist/:email", handleGetUserLikedMovie);
router.delete("/removelikedlist", handleRemoveUserLikedMovie);

export default router;
