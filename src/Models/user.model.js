const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    phone : Number,
    password : String,
    college : String,
    img: String,
    amount: String,
    account: String
}, {
    versionKey : false
})

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
}