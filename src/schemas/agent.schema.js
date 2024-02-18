const { object, string } = require("zod");

const payload = {
  body: object({
    name: string({
      required_error: "name is required",
    }),
    phone: string({
      required_error: "phone is required",
    }),
    code: string().optional(),
  }).optional(),
};

const payloadUpdate = {
  body: object({
    name: string({
      required_error: "name is required",
    }),
    phone: string({
      required_error: "phone is required",
    }),
    code: string().optional(),
  }).optional(),
};

const params = {
  params: object({
    agent_id: string({
      required_error: "agent_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createAgentSchema = object({ ...payload });

exports.updateAgentSchema = object({ ...payloadUpdate, ...params });

exports.readAgentSchema = object({ ...params });

exports.searchAgentSchema = object({ ...query });

exports.deleteAgentSchema = object({ ...params });
