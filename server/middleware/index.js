const expressJWT = require("express-jwt");

const { findUserByID } = require("../services/user");
const { findProductByID } = require("../services/product");

const requireWebToken = expressJWT({
  secret: process.env.JWT,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

const confirmUser = (req, res, next, _id) => {
  findUserByID(_id).exec((err, user) => {
    if (err || !user) {
      return res.status(500).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

const isAuth = (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied - signup is required",
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Administrative page - access denied",
    });
  }
  next();
};

const getProductByID = (req, res, next, _id) => {
  findProductByID(_id).exec((error, product) => {
    if (error || !product) {
      return res.status(500).json({
        error: "Product not found",
      });
    }
    console.log(product);
    req.product = product;
    next();
  });
};

const readProductData = (req, res) => {
  req.product.img = undefined;
  return res.json(req.product);
};

module.exports = {
  requireWebToken,
  getProductByID,
  readProductData,
  confirmUser,
  isAuth,
  isAdmin,
};
