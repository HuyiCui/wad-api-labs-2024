import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Compare Password Method
UserSchema.methods.comparePassword = async function (passw) {
  return await bcrypt.compare(passw, this.password);
};

// Static Method to Find User by Username
UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

// Pre-Save Hook to Hash Password
UserSchema.pre('save', async function (next) {
  const saltRounds = 10; // You can adjust the number of salt rounds
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('User', UserSchema);