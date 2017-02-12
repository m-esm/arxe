var mongoose = require('mongoose');
var LocationSchema = mongoose.Schema({
    _id: { type: String }
    ,
    name: {
        type: String
    }
    ,
    plusCost: {
        type: Number
    }

}, {
        collection: 'Locations',
        strict: true
    });

module.exports = mongoose.model('Location', LocationSchema);
