const { object, string, date } = require("zod");

const payload = {
  body: object({
    arrest_location: string({
      required_error: "arrest_location is required",
    }),
    service: string({
      required_error: "service is required",
    }),
    agent: string({
      required_error: "agent is required",
    }),
    provenance: string({
      required_error: "provenance is required",
    }),
    destination: string({
      required_error: "destination is required",
    }),
    observation: string({
      required_error: "observation is required",
    }),
  }).optional(),
};

const payloadUpdate = {
  body: object({
  }).optional(),
};

const params = {
  params: object({
    fraud_id: string({
      required_error: "fraud_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createFraudSchema = object({ ...payload });

exports.updateFraudSchema = object({ ...payloadUpdate, ...params });

exports.receiveFraudSchema = object({ ...payloadUpdate, ...params });

exports.orientFraudSchema = object({ ...payloadUpdate, ...params });

exports.concludeFraudSchema = object({ ...payloadUpdate, ...params });

exports.readFraudSchema = object({ ...params });

exports.searchFraudSchema = object({ ...query });

exports.deleteFraudSchema = object({ ...params });
