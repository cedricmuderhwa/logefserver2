const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    code: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    name: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Service",
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Region",
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

const AgentModel = mongoose.model("Agent", agentSchema);

module.exports = AgentModel;
