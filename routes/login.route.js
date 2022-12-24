const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const { body, validationResult, check } = require("express-validator");

require("../utils/db");
const User = require("../model/user");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login-page", {
      title: "Login",
      layout: "layouts/main-layout",
    });
  }
});

// router.post("/", (req, res) => {
//   res.redirect("/");
// });

router.post("/", [check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters!")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("login-page", {
      title: "Login",
      layout: "layouts/main-layout",
      errors: errors.array(),
      prevData: req.body,
    });
  } else {
    try {
      const user = await User.findOne({
        username: req.body.username.trim(),
      });
      if (user) {
        const match = await bcrypt.compare(req.body.password.trim(), user.password);
        if (match) {
          req.session.user = user.name;
          req.session.userid = user._id;
          res.redirect("/");
        } else {
          req.flash("msg", "Wrong username or password  ");
          res.render("login-page", {
            title: "Login",
            layout: "layouts/main-layout",
            prevData: req.body,
            msg: req.flash("msg"),
          });
        }
      } else {
        req.flash("msg", "User does not exist");
        res.render("login-page", {
          title: "Login",
          layout: "layouts/main-layout",
          prevData: req.body,
          msg: req.flash("msg"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = router;
