const mongoose = require("mongoose");

const pvsSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.String,
      trim: true,
      enum: [
        // documents de tracabilite qui accompagnent le produit
        "Carte d'électeur ou passeport",
        "Statut carte d'exploitant artisanal(creuseur)",
        "Statut carte de négociant",
        "Agrément comme comptoir",
        "Agrément comme coopérative",
        "Agrément comme entité de traitement ou de transformation",
        "Autres agrément",
        "Autres titre minier",
        "Permis d'exploitation (PE)",
        "Permis d'exploitation de rejet (PER)",
        "Permis d'exploitation de la petite mine (PEPM)",
        "Permis de recherche (PR)",
        "Autorisation d'exploitation",
        "Logbook site minier",
        "Logbook négociant",
        "Logbook comptoir",
        "Attestation de transport",
        "Fiche ou formulaire de transfert",
        "Bon d'achat du CEEC",
        "Certificat d'origine à l'exportation",
        "Certificat CIRGL",
        "Certificat de Kimberley",

        // documents d'instructions du dossier
        "Note technique de constat des faits",
        "Procés verbal de constat des faits",
        "Procés verbal d'audition",
        "Procés verbal de saisi d'objets",
        "Procés verbal de consignation d'objets",
        "Procés verbal de saisi des prevenus",
        "Rapport d'analyse des substances",
        "Procés verbal de gardiennage",
        "Décision d'instruction",

        // Documents d'execution
        "Jugement",
        "Arret",
        "Procés verbal de réstitution",
        "Acte de réconnaissance",
        "Acte de vente",

        // Documents de cloture
        "Rapport de cloture",
      ],
      required: true,
    },
    file_url: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      enum: ["instruction", "tracability", "execution"],
    },
    fraud_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frauds",
      required: true,
    },
    file_no: {
      type: mongoose.Schema.Types.String,
      trim: true,
      required: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Regions",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const PvsModel = mongoose.model("Pv", pvsSchema);

module.exports = PvsModel;
