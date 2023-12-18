const express = require("express");
const { UserModel } = require("../Models/user.model");
const { checkPassword } = require("../Validators/passwordChecker");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../Models/blacklisting.model");
const SpecialKey = process.env.tokenkey;
const { auth } = require("../Middleware/auth.middleware");
const { PaymentTrackModel } = require("../Models/paymentTrack.model");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    if (req.query.userID) {
      const users = await UserModel.findOne({ _id: req.query.userID });
      res.status(200).json(users);
    } else {
      const users = await UserModel.find();
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, college, img, amount, account } =
      req.body;
    const existingUser = await UserModel.find({ email });
    if (existingUser.length) {
      return res
        .status(400)
        .json({ error: "Registration failed User already exists" });
    }
    if (checkPassword(password)) {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({
          name,
          email,
          password: hash,
          phone,
          college,
          img,
          amount,
          account,
        });
        await user.save();
        return res.status(200).json({
          msg: "The new User has been registered",
          registeredUser: user,
        });
      });
    } else {
      res.status(400).json({
        error:
          "Registration failed ! Password should contain atlese one uppercase, one number and one unique character",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      bcrypt.compare(password, existingUser.password, (err, result) => {
        const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        if (result) {
          const token = jwt.sign(
            { userID: existingUser._id, username: existingUser.name },
            SpecialKey,
            {
              expiresIn: expiration,
            }
          );
          return res
            .status(200)
            .json({
              msg: "Login Successfull",
              token: token,
              user: existingUser,
            });
        } else {
          res
            .status(400)
            .json({ msg: "Invalid Credentials! Wrong password provided" });
        }
      });
    } else {
      res
        .status(400)
        .json({ msg: "Invalid Credentials! Wrong email provided" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/logout", async (req, res) => {
  console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization;
    if (token) {
      await BlackListModel.updateMany({}, { $push: { blacklist: [token] } });
      res.status(200).json({ msg: "Logout Successfully!" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

userRouter.patch("/sendMoney/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndUpdate({ _id: id }, req.body);
    console.log(req.body);
    const newTrack = new PaymentTrackModel({
      name: req.body.name,
      img: req.body.img,
      amount: req.body.amount,
      date: req.body.date,
      userID: req.body.userID,
      username: req.body.username,
    });
    await newTrack.save();
    res.status(200).send({ msg: `Money send successfully` });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

userRouter.get("/userhistory", async(req, res) => {
  try {
    const users = await PaymentTrackModel.find({ userID: req.query.userID });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = {
  userRouter,
};
