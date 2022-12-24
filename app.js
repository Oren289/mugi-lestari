const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3001;

// Routers
const loginRoute = require("./routes/login.route");
const logoutRoute = require("./routes/logout.route");
const registerRoute = require("./routes/register.route");
const homeRoute = require("./routes/home.route");
const accountRoute = require("./routes/account.route");
const productListRoute = require("./routes/product-list.route");
const cartRoute = require("./routes/cart.route");
const paymentRoute = require("./routes/payment.route");
const orderListRoute = require("./routes/order-list.route");
const adminLoginRoute = require("./routes/admin-login.route");
const adminHomeRoute = require("./routes/admin-home.route");
const adminEditRoute = require("./routes/admin-edit.route");
const aboutRoute = require("./routes/about.route");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 60000 * 10 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/", homeRoute);
app.use("/myaccount", accountRoute);
app.use("/products", productListRoute);
app.use("/cart", cartRoute);
app.use("/payment", paymentRoute);
app.use("/orders", orderListRoute);
app.use("/admin-login", adminLoginRoute);
app.use("/admin-home", adminHomeRoute);
app.use("/admin-edit", adminEditRoute);
app.use("/about", aboutRoute);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
