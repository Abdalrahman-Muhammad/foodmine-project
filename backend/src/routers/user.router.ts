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

router.route("/login").post((req, res) => {
  const { email, password } = req.body;
  const user = sample_users.find(
    (user) => user["email"] === email && user["password"] === password
  );

  if (user) {
    res.send(generateTokenResponse(user));
  } else {
    res.status(400).send("email or password is not valid");
  }
});

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
  user.token = token;
  return user;
};

export default router;
