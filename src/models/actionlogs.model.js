const mongoose = require("mongoose");

const actionlogSchema = new mongoose.Schema(
  {
    fraud_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fraud",
      required: true,
    },
    title: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    action: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
      enum: [
        "signaled",
        "dismissed",
        "confirmed",
        "transferred",
        "constested_transfer",
        "oriented",
        "concluded",
        "concluded_insito",
        "executed",
        "appel_first",
        "appel_second",
        "closed_insito",
        "closed_by_cnlfm",
        "closed_after_appel",
        "archived",
      ],
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const ActionLogModel = mongoose.model("ActionLog", actionlogSchema);

module.exports = ActionLogModel;
