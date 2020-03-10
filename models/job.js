var mongoose = require("mongoose");

//Schema

var jobSchema = new mongoose.Schema({
    name: String,
    desc: String,
    req: String,
    salary:String,
    image:String
});

module.exports = mongoose.model("Job",jobSchema);
