const dotenv = require("dotenv");
dotenv.config();
const config = require("config");
const requireUser = require("./middlewares/require_user");
const validate = require("./middlewares/validate_resource");

const {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
  changePasswordHandler,
  verifyPassword,
} = require("./controllers/session.controller");
const {
  createUserHandler,
  updateUserHandler,
  getUserHandler,
  disableAccountHandler,
  getLoggedInUserHanlder,
  deleteUserHandler,
  changeUserRegion,
  resetUserAccount,
} = require("./controllers/user.controller");
const {
  createSessionSchema,
  checkPwdSchema,
  changePwdSchema,
} = require("./schemas/session.schema");
const {
  createUserSchema,
  updateUserSchema,
  readUserSchema,
  deleteUserSchema,
} = require("./schemas/user.schema");

const {
  createContainerSchema,
  updateContainerSchema,
  readContainerSchema,
  deleteContainerSchema,
} = require("./schemas/container.schema");
const {
  createContainerHandler,
  getContainerHandler,
  deleteContainerHandler,
  updateContainerHandler,
} = require("./controllers/container.controller");

const {
  createFraudSchema,
  updateFraudSchema,
  readFraudSchema,
  deleteFraudSchema,
  receiveFraudSchema,
  orientFraudSchema,
  concludeFraudSchema,
} = require("./schemas/fraud.schema");
const {
  createFraudHandler,
  getFraudHandler,
  deleteFraudHandler,
  updateFraudHandler,
  receiveFraudHandler,
  orientFraudHandler,
  concludeFraudHandler,
  readActionLogs,
} = require("./controllers/fraud.controller");

const {
  createAgentSchema,
  updateAgentSchema,
  readAgentSchema,
  deleteAgentSchema,
} = require("./schemas/agent.schema");
const {
  createAgentHandler,
  getAgentHandler,
  deleteAgentHandler,
  updateAgentHandler,
} = require("./controllers/agent.controller");

const {
  createPermissionSchema,
  updatePermissionSchema,
  readPermissionSchema,
  deletePermissionSchema,
} = require("./schemas/permissions.schema");
const {
  createPermissionHandler,
  getPermissionHandler,
  deletePermissionHandler,
  updatePermissionHandler,
} = require("./controllers/permissions.controller");

const {
  createPvsSchema,
  updatePvsSchema,
  readPvsSchema,
  deletePvsSchema,
} = require("./schemas/pvs.schema");
const {
  createPvsHandler,
  getPvsHandler,
  deletePvsHandler,
  updatePvsHandler,
} = require("./controllers/pvs.controller");

const {
  createRegionSchema,
  updateRegionSchema,
  readRegionSchema,
  deleteRegionSchema,
} = require("./schemas/region.schema");
const {
  createRegionHandler,
  getRegionHandler,
  deleteRegionHandler,
  updateRegionHandler,
} = require("./controllers/region.controller");

const {
  createServiceSchema,
  updateServiceSchema,
  readServiceSchema,
  deleteServiceSchema,
} = require("./schemas/service.schema");
const {
  createServiceHandler,
  getServiceHandler,
  deleteServiceHandler,
  updateServiceHandler,
} = require("./controllers/service.controller");

const {
  createSubstanceSchema,
  updateSubstanceSchema,
  readSubstanceSchema,
  deleteSubstanceSchema,
} = require("./schemas/substance.schema");
const {
  createSubstanceHandler,
  getSubstanceHandler,
  deleteSubstanceHandler,
  updateSubstanceHandler,
} = require("./controllers/substance.controller");

const { filterSchema } = require("./schemas/report.schema");
const {
  getDashboardReportHandler,
  getStatsReportHandler,
  getQueryReportHandler,
} = require("./controllers/report.controller");
const {
  createFraudeurSchema,
  updateFraudeurSchema,
  readFraudeurSchema,
  deleteFraudeurSchema,
} = require("./schemas/fraudeur.schema");
const {
  createFraudeurHandler,
  updateFraudeurHandler,
  getFraudeurHandler,
  deleteFraudeurHandler,
} = require("./controllers/fraudeur.controller");

function routes(app) {
  // express handling headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.get("origin"));
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  app.get("/api/healthcheck", (req, res) => {
    return res.sendStatus(200);
  });

  // ====================================
  // USER'S ROUTES
  // ====================================

  app.post("/api/users", [validate(createUserSchema)], createUserHandler);
  app.get("/api/me", [requireUser], getLoggedInUserHanlder);
  app.put("/api/deactivate", [requireUser], disableAccountHandler);
  app.patch(
    "/api/users/:user_id",
    [requireUser, validate(updateUserSchema)],
    updateUserHandler
  );
  app.get(
    "/api/users/:user_id",
    [requireUser, validate(readUserSchema)],
    getUserHandler
  );
  app.delete(
    "/api/users/:user_id",
    [requireUser, validate(deleteUserSchema)],
    deleteUserHandler
  );
  app.put(
    "/api/users/:user_id/permissions",
    [requireUser, validate(createPermissionSchema)],
    updatePermissionHandler
  );

  app.put(
    "/api/users/:user_id/reset",
    [requireUser, validate(createPermissionSchema)],
    resetUserAccount
  );

  // ====================================
  // SESSION'S ROUTES
  // ====================================
  app.post(
    "/api/sessions",
    validate(createSessionSchema),
    createUserSessionHandler
  );
  app.post(
    "/api/sessions/confirm-password",
    [requireUser, validate(checkPwdSchema)],
    verifyPassword
  );
  app.put("/api/sessions/change-region", [requireUser], changeUserRegion);
  app.post(
    "/api/sessions/change-password",
    [requireUser, validate(changePwdSchema)],
    changePasswordHandler
  );
  app.get("/api/sessions", requireUser, getUserSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  // ====================================
  // CONTAINERS ROUTES
  // ====================================
  app.post(
    "/api/containers",
    [requireUser, validate(createContainerSchema)],
    createContainerHandler
  );
  app.patch(
    "/api/containers/:container_id",
    [requireUser, validate(updateContainerSchema)],
    updateContainerHandler
  );
  app.get(
    "/api/containers/:container_id",
    [requireUser, validate(readContainerSchema)],
    getContainerHandler
  );
  app.delete(
    "/api/containers/:container_id",
    [requireUser, validate(deleteContainerSchema)],
    deleteContainerHandler
  );

  // ====================================
  // FRAUD ROUTES
  // ====================================
  app.post(
    "/api/frauds",
    [requireUser, validate(createFraudSchema)],
    createFraudHandler
  );
  app.patch(
    "/api/frauds/:fraud_id",
    [requireUser, validate(updateFraudSchema)],
    updateFraudHandler
  );
  app.put(
    "/api/frauds/:fraud_id/reception",
    [requireUser, validate(receiveFraudSchema)],
    receiveFraudHandler
  );
  app.put(
    "/api/frauds/:fraud_id/orientation",
    [requireUser, validate(orientFraudSchema)],
    orientFraudHandler
  );
  app.put(
    "/api/frauds/:fraud_id/conclusion",
    [requireUser, validate(concludeFraudSchema)],
    concludeFraudHandler
  );
  app.get(
    "/api/frauds/:fraud_id",
    [requireUser, validate(readFraudSchema)],
    getFraudHandler
  );
  app.delete(
    "/api/frauds/:fraud_id",
    [requireUser, validate(deleteFraudSchema)],
    deleteFraudHandler
  );

  // ====================================
  // AGENTS ROUTES
  // ====================================
  app.post(
    "/api/agents",
    [requireUser, validate(createAgentSchema)],
    createAgentHandler
  );
  app.patch(
    "/api/agents/:agent_id",
    [requireUser, validate(updateAgentSchema)],
    updateAgentHandler
  );
  app.get(
    "/api/agents/:agent_id",
    [requireUser, validate(readAgentSchema)],
    getAgentHandler
  );
  app.delete(
    "/api/agents/:agent_id",
    [requireUser, validate(deleteAgentSchema)],
    deleteAgentHandler
  );

  // ====================================
  // PERMISSIONS ROUTES
  // ====================================
  app.post(
    "/api/permissions",
    [requireUser, validate(createPermissionSchema)],
    createPermissionHandler
  );
  app.patch(
    "/api/permissions/:permission_id",
    [requireUser, validate(updatePermissionSchema)],
    updatePermissionHandler
  );
  app.get(
    "/api/permissions/:permission_id",
    [requireUser, validate(readPermissionSchema)],
    getPermissionHandler
  );
  app.delete(
    "/api/permissions/:permission_id",
    [requireUser, validate(deletePermissionSchema)],
    deletePermissionHandler
  );

  // ====================================
  // PVS ROUTES
  // ====================================
  app.post(
    "/api/pvs",
    [requireUser, validate(createPvsSchema)],
    createPvsHandler
  );
  app.patch(
    "/api/pvs/:pv_id",
    [requireUser, validate(updatePvsSchema)],
    updatePvsHandler
  );
  app.get(
    "/api/pvs/:pv_id",
    [requireUser, validate(readPvsSchema)],
    getPvsHandler
  );
  app.delete(
    "/api/pvs/:pv_id",
    [requireUser, validate(deletePvsSchema)],
    deletePvsHandler
  );

  // ====================================
  // REGION ROUTES
  // ====================================
  app.post("/api/regions", [validate(createRegionSchema)], createRegionHandler);
  app.patch(
    "/api/regions/:region_id",
    [requireUser, validate(updateRegionSchema)],
    updateRegionHandler
  );
  app.get(
    "/api/regions/:region_id",
    [requireUser, validate(readRegionSchema)],
    getRegionHandler
  );
  app.delete(
    "/api/regions/:region_id",
    [requireUser, validate(deleteRegionSchema)],
    deleteRegionHandler
  );

  // ====================================
  // SERVICES ROUTES
  // ====================================
  app.post(
    "/api/services",
    [requireUser, validate(createServiceSchema)],
    createServiceHandler
  );
  app.patch(
    "/api/services/:service_id",
    [requireUser, validate(updateServiceSchema)],
    updateServiceHandler
  );
  app.get(
    "/api/services/:service_id",
    [requireUser, validate(readServiceSchema)],
    getServiceHandler
  );
  app.delete(
    "/api/services/:service_id",
    [requireUser, validate(deleteServiceSchema)],
    deleteServiceHandler
  );

  // ====================================
  // FRAUDEURS ROUTES
  // ====================================
  app.post(
    "/api/fraudeurs",
    [requireUser, validate(createFraudeurSchema)],
    createFraudeurHandler
  );
  app.patch(
    "/api/fraudeurs/:fraudeur_id",
    [requireUser, validate(updateFraudeurSchema)],
    updateFraudeurHandler
  );
  app.get(
    "/api/fraudeurs/:fraudeur_id",
    [requireUser, validate(readFraudeurSchema)],
    getFraudeurHandler
  );
  app.delete(
    "/api/fraudeurs/:fraudeur_id",
    [requireUser, validate(deleteFraudeurSchema)],
    deleteFraudeurHandler
  );

  // ====================================
  // Logs ROUTES
  // ====================================
  app.get("/api/logs/:log_id", [requireUser], readActionLogs);

  // ====================================
  // AGENT ROUTES
  // ====================================
  app.post(
    "/api/substances",
    [requireUser, validate(createSubstanceSchema)],
    createSubstanceHandler
  );
  app.patch(
    "/api/substances/:substance_id",
    [requireUser, validate(updateSubstanceSchema)],
    updateSubstanceHandler
  );
  app.get(
    "/api/substances/:substance_id",
    [requireUser, validate(readSubstanceSchema)],
    getSubstanceHandler
  );
  app.delete(
    "/api/substances/:substance_id",
    [requireUser, validate(deleteSubstanceSchema)],
    deleteSubstanceHandler
  );

  // ====================================
  // REPORTS ROUTES
  // ====================================
  app.post(
    "/api/reports/query",
    [requireUser, validate(filterSchema)],
    getQueryReportHandler
  );
  app.post(
    "/api/reports/stats",
    [requireUser, validate(filterSchema)],
    getStatsReportHandler
  );
  app.post("/api/reports/dashboard", requireUser, getDashboardReportHandler);

  // Error handling
  app.use(function (req, res, next) {
    return res
      .status(404)
      .json({ status: 404, success: false, message: "Not Found" });
  });
}

module.exports = routes;
