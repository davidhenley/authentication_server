const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String }
});

UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });

});

const user = mongoose.model('user', UserSchema);

module.exports = user;
