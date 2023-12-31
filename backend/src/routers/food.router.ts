import express from "express";
import { sample_foods } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";

const router = express.Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await FoodModel.create(sample_foods);
    res.send("Seed Is Done!");
  })
);

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const foods = await FoodModel.find();
      res.send(foods);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      const newFood = await FoodModel.create(req.body);

      res.send(newFood);
    })
  );

router.route("/search/:searchTerm").get(
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });

    res.send(foods);
  })
);

router.route("/tags").get(
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    //? add all tag to the beginning of the tags
    tags.unshift(all);
    res.send(tags);
  })
);

router.route("/tag/:tagName").get(
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params["tagName"] });
    res.send(foods);
  })
);

router
  .route("/:foodId")
  .get(
    asyncHandler(async (req, res) => {
      const food = await FoodModel.findById(req.params.foodId);
      res.send(food);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      await FoodModel.findByIdAndDelete(req.params["foodId"]);
      res.send();
    })
  )
  .put(
    asyncHandler(async (req, res) => {
      const food = await FoodModel.findByIdAndUpdate(
        req.params["foodId"],
        req.body,
        { new: true }
      );
      console.log(req.body);
      res.send(food);
    })
  );

export default router;
