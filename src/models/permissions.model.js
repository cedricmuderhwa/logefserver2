const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    READ_SENSITIVE_DATA: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    READ_CASE_DATA: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    SIGNAL_FRAUD_CASE: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    ADD_DATA_TO_CASE: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    MODIFY_CASE_STATUS: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    MODIFY_USERS_INFO: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    READ_FRAUD_REPORTS: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    READ_ADVISOR_INFO: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    READ_FRAUD_STATISTICS: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    ADD_REGION: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    CHANGE_LOCATION: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    ADD_MEMBER_SERVICE: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    INVITE_MEMBERS: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    ADD_ADVISOR: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
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

const PermissionModel = mongoose.model("Permission", permissionSchema);

module.exports = PermissionModel;
