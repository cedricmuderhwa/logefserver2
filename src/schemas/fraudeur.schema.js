const { object, string, number, boolean } = require("zod");

const payload = {
  body: object({
    isNegociant: boolean({
      required_error: "isNegociant required",
    }).optional(),
    nationalite: string({
      required_error: "nationalite is required",
    }),
    gender: string({
      required_error: "gender is required",
    }),
    prenom: string({
      required_error: "prenom required",
    }),
    postnom: string({
      required_error: "postnom required",
    }),
    nom: string({
      required_error: "nom required",
    }),
  }).optional(),
};

const payloadUpdate = {
  body: object({
    isNegociant: boolean({
      required_error: "isNegociant required",
    }).optional(),
    nationalite: string({
      required_error: "nationalite is required",
    }),
    gender: string({
      required_error: "gender is required",
    }),
    prenom: string({
      required_error: "prenom required",
    }),
    postnom: string({
      required_error: "postnom required",
    }),
    nom: string({
      required_error: "nom required",
    }),
  }).optional(),
};

const params = {
  params: object({
    fraudeur_id: string({
      required_error: "fraudeur_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createFraudeurSchema = object({ ...payload });

exports.updateFraudeurSchema = object({ ...payloadUpdate, ...params });

exports.readFraudeurSchema = object({ ...params });

exports.searchFraudeurSchema = object({ ...query });

exports.deleteFraudeurSchema = object({ ...params });
