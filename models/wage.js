var mongoose = require('mongoose');
var WageSchema = mongoose.Schema({
    _id: { type: String }
    ,
    start: {
        type: Date
    },
    startJalali: {
        type: String
    },
    perHour: {
        type: Number
    },
    personId : {
        type: String
    }
}, {
        collection: 'Wages',
        strict: true
    });

module.exports = mongoose.model('Wage', WageSchema);
