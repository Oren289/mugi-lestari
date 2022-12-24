const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const { body, validationResult, check } = require("express-validator");

require("../utils/db");
const User = require("../model/user");
const Cart = require("../model/cart");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("register-page", {
      title: "Login",
      layout: "layouts/main-layout",
      errors: [],
    });
  }
});

router.post(
  "/",
  [
    body("username").custom(async (value) => {
      const duplikat = await User.findOne({ username: value });
      if (duplikat) {
        throw new Error("Username is already used, pick another!");
      }
      return true;
    }),
    check("email", "Email is invalid!").isEmail(),
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register-page", {
        title: "Register",
        layout: "layouts/main-layout",
        errors: errors.array(),
        prevData: req.body,
      });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const query = {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        };
        await User.insertMany(query);

        const cartQuery = {
          username: req.body.username,
          products: [],
        };

        await Cart.insertMany(cartQuery);

        res.redirect("/register/register-success");
      } catch (error) {
        console.log(error);
      }
    }
  }
);

router.get("/register-success", (req, res) => {
  res.render("register-success-page", {
    title: "Register Success",
    layout: "layouts/main-layout",
  });
});

module.exports = router;
