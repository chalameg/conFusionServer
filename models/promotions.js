const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promoShema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});
const Promotions = mongoose.model("Promotion", promoShema);

module.exports = Promotions;