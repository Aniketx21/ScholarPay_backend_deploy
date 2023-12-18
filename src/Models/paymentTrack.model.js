const mongoose = require("mongoose");

const paymentTrackSchema = mongoose.Schema({
    name: String,
    img: String,
    amount: String,
    date: String,
    userID: String,
    username: String,
}, {
    versionKey: false
})

const PaymentTrackModel = mongoose.model("paymentTrack", paymentTrackSchema);

module.exports = {
    PaymentTrackModel
}