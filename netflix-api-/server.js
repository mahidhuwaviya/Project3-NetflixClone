import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routes/userRoute.js";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Mongo Atlas");
  })
  .catch((err) => {
    console.log("Error connecting to MONGO Atlas", err);
  });

app.use("/api/user", UserRouter);

app.listen(process.env.PORT, () => {
  console.log(`Connected to Server at PORT:${process.env.PORT}`);
});
