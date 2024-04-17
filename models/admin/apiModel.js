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
        enum: ['expired', 'account_activated', 'expired_soon', 'account_created'],
        type: String,
    }

});

const templateModel = mongoose.model("Template", templateScehma);
module.exports = templateModel;