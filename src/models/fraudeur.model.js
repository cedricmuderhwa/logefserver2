const mongoose = require("mongoose");

const fraudeurSchema = new mongoose.Schema(
  {
    nom: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    postnom: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    prenom: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    gender: {
      type: mongoose.Schema.Types.String,
      trim: true,
      enum: ["male", "female", "minor"],
    },
    nationalite: {
      type: mongoose.Schema.Types.String,
      trim: true,
    },
    casesList: [
      {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    ],
    forfaits: {
      type: mongoose.Schema.Types.Number,
      trim: true,
      default: 0,
    },
    isNegociant: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
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

const FraudeurModel = mongoose.model("Fraudeur", fraudeurSchema);

module.exports = FraudeurModel;
