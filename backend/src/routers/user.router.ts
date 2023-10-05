import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import express from "express";
import { sample_users } from "../data";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST, HTTP_CONFLICT } from "../constants/http_status";
import bcrypt from "bcryptjs";

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

  return user;
};

router.route("/login").post(
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user!["password"]);

    if (isPasswordCorrect) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("email or password is not valid");
    }
  })
);

router.route("/register").post(
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_CONFLICT).json("User is Already Exist, Please Login");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    };

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  })
);

export default router;
