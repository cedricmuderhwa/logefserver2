const { object, string } = require("zod");

const payload = {
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }).optional(),
};

const payloadUpdate = {
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }).optional(),
};

const params = {
  params: object({
    container_id: string({
      required_error: "container_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createContainerSchema = object({ ...payload });

exports.updateContainerSchema = object({ ...payloadUpdate, ...params });

exports.readContainerSchema = object({ ...params });

exports.searchContainerSchema = object({ ...query });

exports.deleteContainerSchema = object({ ...params });
