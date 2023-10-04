import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import express from "express";
import { sample_users } from "../data";
import { UserModel } from "../models/user.model";

const router = express.Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  })
);

const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      email: user["email"],
      isAdmin: user["isAdmin"],
    },
    "SomeRandomText",
    {
      expiresIn: "30d",
    }
  );
  user = { ...user["_doc"], token };
  console.log(
    "🚀 ~ file: user.router.ts:35 ~ generateTokenResponse ~ user:",
    user
  );
  return user;
};

router.route("/login").post(
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });

    if (user) {
      console.log("User data:", user);
      res.send(generateTokenResponse(user));
    } else {
      res.status(400).send("email or password is not valid");
    }
  })
);

export default router;
