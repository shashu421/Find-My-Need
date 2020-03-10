var mongoose = require("mongoose");

var phoneSchema = new mongoose.Schema({
    phonenumber:String
});

module.exports = mongoose.model("Phone",phoneSchema);