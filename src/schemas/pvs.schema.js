const { object, string } = require("zod");

const payload = {
  body: object({
    category: string({
      required_error: "category required",
    }),
    file_no: string({ required_error: "file_no is required" }),
    file_url: string({ required_error: "file_url is required" }),
  }).optional(),
};

const payloadUpdate = {
  body: object({
    category: string({
      required_error: "category required",
    }),
    file_no: string({ required_error: "file_no is required" }),
    file_url: string({ required_error: "file_url is required" }),
  }).optional(),
};

const params = {
  params: object({
    pv_id: string({
      required_error: "pv_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createPvsSchema = object({ ...payload });

exports.updatePvsSchema = object({ ...payloadUpdate, ...params });

exports.readPvsSchema = object({ ...params });

exports.searchPvsSchema = object({ ...query });

exports.deletePvsSchema = object({ ...params });
