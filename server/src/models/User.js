const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const SALT_WORK_FACTOR = 8;

//Create user Schema and Model
const UserSchema = new Schema({
    email:{
        type: String,
        required: [true, 'Email field is required'],
        unique: true
    },
    name:{
        type: String
    },
    password:{
        type: String,
        required: [true, 'Password field is required']
    }
});

//before save
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
const User = mongoose.model('user', UserSchema);
module.exports = User;