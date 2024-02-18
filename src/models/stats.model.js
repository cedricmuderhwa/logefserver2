const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    total_cases: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    dismissed: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    confirmed: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    transferred: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    constested_transfer: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    oriented: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    conclusion: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    conclusion_insito: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    executed: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    appel: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    appel_first: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    appel_second: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    closedInsito: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    closed_by_cnlfm: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    closed_after_appel: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    archived: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
      required: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Region",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const StatModel = mongoose.model("Stat", statSchema);

module.exports = StatModel;
