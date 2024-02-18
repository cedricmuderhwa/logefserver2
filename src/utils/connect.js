const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const config = require("config");
const logger = require("./logger");
const { createUser, countUsers } = require("../services/user.service");
const { createRegion } = require("../services/region.service");
const { createService } = require("../services/service.service");
const { createStat } = require("../services/stat.service");
const { createPermissions } = require("../services/permissions.service");

mongoose.set("strictQuery", true);

const defaultUser = {
  first_name: "Admin",
  last_name: "National",
  user_role: "Admin national",
  isNational: true,
  isNewUser: true,
  email: "cnlfmlogef@gmail.com",
  phone: "000000",
  password: "Password456!",
  isActive: true,
  isAvailable: true,
};

const defaultRegion = {
  region: "Province du Nord-Kivu",
};

const defaultService = {
  service_name: "CEEC",
  code: "001",
};

async function createDefault() {
  const region = await createRegion(defaultRegion);
  await createStat({ region: region._id });
  const service = await createService({
    ...defaultService,
    region: region._id,
  });
  const permissions = await createPermissions({
    role: defaultUser.user_role,
    READ_CASE_DATA: true,
    READ_SENSITIVE_DATA: true,
    SIGNAL_FRAUD_CASE: true,
    ADD_DATA_TO_CASE: true,
    MODIFY_CASE_STATUS: true,
    MODIFY_USERS_INFO: true,
    READ_FRAUD_REPORTS: true,
    READ_ADVISOR_INFO: true,
    READ_FRAUD_STATISTICS: true,
    ADD_REGION: true,
    CHANGE_LOCATION: true,
    ADD_MEMBER_SERVICE: true,
    INVITE_MEMBERS: true,
    ADD_ADVISOR: true,
  });
  await createUser({
    ...defaultUser,
    region: region._id,
    service: service._id,
    permissions: permissions._id,
  });
  logger.info("initial user created!");
}

async function connect() {
  const dbUri = config.get("dbUri");

  try {
    await mongoose.connection.once("open", async () => {
      const userCount = await countUsers();

      if (userCount > 0) return;

      await createDefault();
    });

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("DB connected");
  } catch (error) {
    console.error(error);
    logger.error("Could not connect to the db");
    process.exit(1);
  }
}

module.exports = connect;
