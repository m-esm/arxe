var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({

    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    role: {
        type: String
    }
}, {
        collection: 'Users',
        strict: false
    });


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}



module.exports.resetUserPassword = function (userId, newPassword, callback) {


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, function (err, hash) {

            User.findOneAndUpdate({ _id: userId },
                { $set: { password: hash } }, { upsert: false, 'new': true }, function (err, model) {

                    callback(model);

                });

        });
    });
}


module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function (email, callback) {
    var query = { email: email };
    console.log(query);
    User.findOne(query, callback);
}


module.exports.getUserById = function (id, callback) {
    User.findById(id, '-password', callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}