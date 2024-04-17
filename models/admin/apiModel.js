const mongoose = require('mongoose');
const templateScehma = mongoose.Schema({

    template_name: {
        type: String,
        requireed: true,
    },
    template_lang: {
        type: String,
        required: true,
    },
    template_type: {
        enum: ['expired', 'renewal'],
        type: String,
    }

});

const templateModel = mongoose.model("Template", templateScehma);
module.exports = templateModel;