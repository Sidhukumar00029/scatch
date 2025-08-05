const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("index", { success, error, loggedin: false });
});

router.get("/shop", isloggedin, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});


router.get("/cart", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email }).populate("cart");

  const bill = Number(user.cart[0].price) + 20 -  Number(user.cart[0].discount);
  res.render("cart", { user, bill });
});

router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  let success = "Added to cart";
  let products = await productModel.find();
  res.render("shop", { products, success });
});

router.get("/logout", isloggedin, function (req, res) {
  res.render("shop");
});

module.exports = router;







// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user-model");
// const productModel = require("../models/product-model");
// const isloggedIn = require("../middlewares/isLoggedIn");

// // Register form
// router.get("/register", (req, res) => {
//   const error = req.flash("error");
//   res.render("register", { error }); 
// });

// // Register user
// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;

//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) {
//     req.flash("error", "Email already registered");
//     return res.redirect("/register");
//   }

//   const user = await userModel.create({ email, password });
//   const token = jwt.sign({ email: user.email }, process.env.JWT_KEY);

//   res.cookie("token", token, { httpOnly: true });
//   res.redirect("/");
// });

// // Login form
// router.get("/login", (req, res) => {
//   const error = req.flash("error");
//   res.render("login", { error });
// });

// // Login user
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email, password });
//   if (!user) {
//     req.flash("error", "Invalid email or password");
//     return res.redirect("/login");
//   }

//   const token = jwt.sign({ email: user.email }, process.env.JWT_KEY);
//   res.cookie("token", token, { httpOnly: true });
//   res.redirect("/");
// });

// // Logout
// router.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/login");
// });

// // Dashboard
// router.get("/", isloggedIn, (req, res) => {
//   const error = req.flash("error");
//   res.render("index", { user: req.user, error });
// });

// // Shop Page
// router.get("/shop", isloggedIn, async (req, res) => {
//   try {
//     let sortQuery = {};
//     const sortby = req.query.sortby;

//     if (sortby === "newest") {
//       sortQuery = { createdAt: -1 };
//     } else if (sortby === "popular") {
//       sortQuery = { popularity: -1 }; // Make sure this field exists
//     }

//     const products = await productModel.find().sort(sortQuery);
//     res.render("shop", {
//       user: req.user,
//       products,
//     });
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     req.flash("error", "Could not load products");
//     res.redirect("/");
//   }
// });

// module.exports = router;
