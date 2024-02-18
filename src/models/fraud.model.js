const mongoose = require("mongoose");

const fraudSchema = new mongoose.Schema(
  {
    isConfirmed: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      trim: true,
      default: false,
    },
    code: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: false,
    },
    index: {
      type: mongoose.Schema.Types.Number,
      required: true,
      trim: true,
      default: 0,
    },
    status: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
      enum: [
        "signal",
        "sans-suite",
        "confirmed",
        "concluded-insito",
        "transferred",
        "oriented",
        "concluded_restitution_avec_amende",
        "concluded_restitution_sans_amende",
        "concluded_restitution_legal",
        "concluded_confiscation",
        "execution",
        "fixation",
        "cloture",
      ],
      default: "signal",
    },
    isClosedInsito: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    isCaseClosed: {
      type: mongoose.Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    signalement: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      date: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      arrest_location: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      provenance: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      destination: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      agent: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        trim: true,
      },
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    reception: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      transfer_date: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      reception_date: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    orientation: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      date: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      classification: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      instruction: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      services_instructeur: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          trim: true,
        },
      ],
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    conclusion: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      date: {
        type: mongoose.Schema.Types.Date,
        required: false,
        trim: true,
      },
      decision: {
        type: mongoose.Schema.Types.String,
        trim: true,
        enum: [
          "concluded_restitution_avec_amende",
          "concluded_restitution_sans_amende",
          "concluded_restitution_legal",
          "concluded_confiscation",
        ],
      },
      no_decision: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      amende: {
        type: mongoose.Schema.Types.Number,
        trim: true,
      },
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    execution: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      date: {
        type: mongoose.Schema.Types.Date,
        required: false,
        trim: true,
      },
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    appel: {
      isComplete: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false,
      },
      date: {
        type: mongoose.Schema.Types.Date,
        required: false,
        trim: true,
      },
      level: {
        type: mongoose.Schema.Types.Number,
        trim: true,
        default: 0,
      },
      target: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      observation: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
    },
    logs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
      trim: true,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pv",
        trim: true,
      },
    ],
    substances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Substance",
        trim: true,
      },
    ],
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invitation",
        trim: true,
      },
    ],
    meeting: {
      location: {
        type: mongoose.Schema.Types.String,
        trim: true,
      },
      date_meeting: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      time_meeting: {
        type: mongoose.Schema.Types.Date,
        trim: true,
      },
      service: [
        {
          type: mongoose.Schema.Types.String,
          trim: true,
        },
      ],
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        trim: true,
      },
    ],
    prevenus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prevenu",
        trim: true,
      },
    ],
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const FraudModel = mongoose.model("Fraud", fraudSchema);

module.exports = FraudModel;
