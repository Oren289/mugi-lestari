const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const dotenv = require('dotenv').config();
const connectDB = require('./utils/db');
const MongoDBStore = require('connect-mongodb-session')(session);

const http = require('http');

const app = express();
const port = process.env.PORT || 3001;
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions',
});
connectDB();

// Routers
const loginRoute = require('./routes/login.route');
const logoutRoute = require('./routes/logout.route');
const registerRoute = require('./routes/register.route');
const homeRoute = require('./routes/home.route');
const accountRoute = require('./routes/account.route');
const productListRoute = require('./routes/product-list.route');
const cartRoute = require('./routes/cart.route');
const paymentRoute = require('./routes/payment.route');
const orderListRoute = require('./routes/order-list.route');
const adminLoginRoute = require('./routes/admin/admin-login.route');
const adminLogoutRoute = require('./routes/admin/admin-logout.route');
const adminHomeRoute = require('./routes/admin/admin-home.route');
const adminOrderListRoute = require('./routes/admin/admin-order-list.route');
const adminProductListRoute = require('./routes/admin/admin-product-list.route');
const adminUmkmListRoute = require('./routes/admin/admin-umkm-list.route');
const adminEditRoute = require('./routes/admin/admin-edit.route');
const aboutRoute = require('./routes/about.route');
const umkmLoginRoute = require('./routes/umkm/umkm-login.route');
const umkmHomeRoute = require('./routes/umkm/umkm-home.route');
const umkmOrderListRoute = require('./routes/umkm/umkm-order-list.route');
const umkmEditRoute = require('./routes/umkm/umkm-edit.route');
const umkmProductListRoute = require('./routes/umkm/umkm-product-list.route');
const umkmLogoutRoute = require('./routes/umkm/umkm-logout.route');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));
app.use(
  session({
    name: 'MyCoolWebAppCookieName',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    // cookie: { secure: false, httpOnly: false, maxAge: 60000 * 10, sameSite: 'none' },
    store,
  })
);
app.use(flash());

app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/register', registerRoute);
app.use('/', homeRoute);
app.use('/myaccount', accountRoute);
app.use('/products', productListRoute);
app.use('/cart', cartRoute);
app.use('/payment', paymentRoute);
app.use('/orders', orderListRoute);
app.use('/admin-login', adminLoginRoute);
app.use('/admin-logout', adminLogoutRoute);
app.use('/admin-home', adminHomeRoute);
app.use('/admin-order-list', adminOrderListRoute);
app.use('/admin-product-list', adminProductListRoute);
app.use('/admin-umkm-list', adminUmkmListRoute);
app.use('/admin-edit', adminEditRoute);
app.use('/umkm-login', umkmLoginRoute);
app.use('/umkm-home', umkmHomeRoute);
app.use('/umkm-order-list', umkmOrderListRoute);
app.use('/umkm-edit', umkmEditRoute);
app.use('/umkm-product-list', umkmProductListRoute);
app.use('/umkm-logout', umkmLogoutRoute);
app.use('/about', aboutRoute);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
