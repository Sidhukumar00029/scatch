const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// module.exports.registerUser = async function (req, res) {
//   try {
//     let { fullname, email, password } = req.body;

//     let user = await userModel.findOne({ email: email });

//     if (user) {
//       req.flash("error", "User already exists");
//       return res.redirect("/");
//     }

//     bcrypt.genSalt(10, function (err, salt) {
//       bcrypt.hash(password, salt, async function (err, hash) {
//         if (err) return res.send(err.message);
//         else {
//           let user = await userModel.create({
//             fullname,
//             email,
//             password: hash,
//           });

//           let token = generateToken(user);
//           console.log(token);
//           res.cookie("token", token);
//           req.flash("success", "User created successfully");
//           // OPTIONAL: Set a flash message before redirecting
//           // res.render("index", { success: "User created successfully" });
//           res.redirect("/");
//           // res.send("user created successfully");
//         }
//       });
//     });

//     // res.send(user);
//   } catch (err) {
//     res.send(err.message);
//   }
// };


module.exports.registerUser = async function (req, res) {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    res.cookie("token", token);

    req.flash("success", "User created successfully");
    return res.redirect("/");

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/");
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.send("Email or password is incorrect");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Email or password is incorrect");
    }

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    // OPTIONAL: Set a flash message before redirecting
    req.flash("success", "Login successful");
    res.redirect("/shop");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  }
};
