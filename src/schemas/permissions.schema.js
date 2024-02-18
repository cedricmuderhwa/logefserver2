const { object, string } = require("zod");

const payload = {
  body: object({}).optional(),
};

const payloadUpdate = {
  body: object({}).optional(),
};

const params = {
  params: object({
    permission_id: string({
      required_error: "permission_id is required",
    }),
  }).optional(),
};

const query = {
  query: object({}).optional(),
};

exports.createPermissionSchema = object({ ...payload });

exports.updatePermissionSchema = object({ ...payloadUpdate, ...params });

exports.readPermissionSchema = object({ ...params });

exports.searchPermissionSchema = object({ ...query });

exports.deletePermissionSchema = object({ ...params });
