const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'password of the product must be present']
    },
    access_level: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    }
}, {
    versionKey: false
});

userSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew()) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                next(err);
            } else {
                bcrypt.hash(user.password, salt, (errHash, hash) => {
                    if (err) {
                        next(err);
                    } else {
                        user.password = hash;
                        next();
                    }
                });
            }
        });
    } else {
        next();
    }
});

const UserModel = new mongoose.model('users', userSchema);

module.exports = {
    UserModel
}