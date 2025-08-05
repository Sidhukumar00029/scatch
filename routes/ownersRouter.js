const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-models");

if(process.env.NODE_ENV === "development"){
  router.post("/create", async function(req, res) {
    let owners = await ownerModel.find();
    if(owners.length > 0){
      return res.status(503).send("Owners already exist");
    }
    let createdOwner = await ownerModel.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
    })
  res.status(201).send("createdOwner");
});
}


// Respond to GET /owner (singular) for clarity
router.get("/owner", function(req, res) {
  res.send("Hey, /owner route is working");
});

// Existing plural route
router.get("/admin", function(req, res) {
  let success = req.flash("success");
  res.render("createproducts", { success });
});





module.exports = router;