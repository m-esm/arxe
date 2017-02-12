var mongoose = require('mongoose');
var ProjectSchema = mongoose.Schema({
    _id: { type: String }
    ,
    name: {
        type: String
    },
    type: {
        type: String
    },
    location: {
        type: String
    }
}, {
        collection: 'Projects',
        strict: true
    });

module.exports = mongoose.model('Project', ProjectSchema);
