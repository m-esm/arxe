var mongoose = require('mongoose');

var trashSchema = mongoose.Schema({
}, {
        collection: 'Trash',
        strict: false
    });

module.exports = mongoose.model('Trash', trashSchema);
