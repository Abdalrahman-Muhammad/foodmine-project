import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import cors from "cors";

import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
import { dbConnect } from "./configs/database.config";

dbConnect();
//app
const app = express();
//global middleware
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

//routes
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
