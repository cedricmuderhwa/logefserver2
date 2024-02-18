const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    isActive: {
      trim: true,
      type: mongoose.Schema.Types.Boolean,
      default: true,
    },
    isNewUser: {
      trim: true,
      type: mongoose.Schema.Types.Boolean,
      default: true,
    },
    isAvailable: {
      trim: true,
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    first_name: {
      trim: true,
      type: mongoose.Schema.Types.String,
      maxlength: 50,
    },
    last_name: {
      trim: true,
      type: mongoose.Schema.Types.String,
      maxlength: 50,
    },
    quality: {
      trim: true,
      type: mongoose.Schema.Types.String,
      maxlength: 50,
    },
    user_role: {
      trim: true,
      type: mongoose.Schema.Types.String,
      enum: ["Admin national", "Admin provincial", "Point focal"],
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      trim: true,
      index: true,
      required: true,
      unique: 1,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      trim: true,
      index: true,
      required: true,
      unique: 1,
    },
    password: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
      select: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Region",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
      required: true,
    },
    permissions: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Permission",
    },
    last_session: {
      valid: { type: mongoose.Schema.Types.Boolean, default: false },
      userAgent: { type: mongoose.Schema.Types.String, trim: true },
      createdAt: { type: mongoose.Schema.Types.Date, trim: true },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods;

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

module.exports = mongoose.model("User", userSchema);
