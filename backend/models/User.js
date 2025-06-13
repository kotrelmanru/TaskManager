/* models/User.js */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
  {
    // UUID sebagai ID unik
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    _id: {
      type: String,
      default: uuidv4,
    },

    // Nama lengkap user
    name: {
      type: String,
      required: true,
    },

    // Username unik
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Password terenkripsi
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // tidak dikembalikan secara default
    },

    // Preferred timezone
    preferred_timezone: {
      type: String,
      default: "UTC",
    },
  },
  { timestamps: true }
);

// Hash password sebelum menyimpan
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method untuk membandingkan password
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);