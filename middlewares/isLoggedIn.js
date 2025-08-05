const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  console.log(req.cookies);
  const token = req.cookies.token;

  if (!token) {
    console.log("Token not found");
    req.flash("error", "You need to login first");
    return res.redirect("/login"); // ✅ Redirect to a public login page
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    req.user = user;
    console.log("User authenticated:", user.email);
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    req.flash("error", "Session expired. Please login again.");
    return res.redirect("/login"); // ✅ Again, redirect to public route
  }
};
