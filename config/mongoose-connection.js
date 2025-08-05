const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')('development:mongoose');


mongoose
.connect(`${process.env.MONGO_URI}/scatch`)
.then(function() {
    dbgr("MongoDB connected");
    console.log("MongoDB connected");
})
.catch(function(err) {
    dbgr("MongoDB connection error:", err);
    console.log("MongoDB connection error:", err);
})

module.exports = mongoose.connection;
