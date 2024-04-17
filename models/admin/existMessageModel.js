const mongoose = require('mongoose');
const existMessageSchema = mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    expiredSoonMessage: {
        type: Number,
        default: 0,
    }, 
    expiredMessage:{
        type: Number,
        default: 0,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true,
        get: (timestamp) => timestamp.getTime(),
        set: (timestamp) => new Date(timestamp),
      },

});

const ExistMessage = mongoose.model('ExistMessage', existMessageSchema);
module.exports = ExistMessage; 

