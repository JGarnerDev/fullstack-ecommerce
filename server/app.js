// Our server application is an instance of express
const app = require("express")();

// Middleware
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Morgan, for development of routes
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(morgan("dev"));

// Routes, held in the 'routes' directory

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/productCategories");
const paymentRoute = require("./routes/payment");

// For listing users, sign up, logging in, and logging out
app.use("/api/auth", authRoute);
// For authenticated users
app.use("/api/user", userRoute);
// For product categories
app.use("/api/categories", categoriesRoute);
// For listing products and other CRUD
app.use("/api/products", productsRoute);
// For listing products and other CRUD
app.use("/api/checkout", paymentRoute);

// If route is not found, respond with the literal string
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// If there is an internal server error, respond with the error in detail
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error });
});

module.exports = app;
