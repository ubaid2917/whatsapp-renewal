const mongoose = require('mongoose');

const planSchema = mongoose.Schema({

    planName: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    }
}) 

const planModel = mongoose.model('Plan', planSchema);
module.exports = planModel;