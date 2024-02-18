const {
  createUser,
  findUser,
  updateUser,
  deleteUser,
  findManyUsers,
} = require("../services/user.service");
const logger = require("../utils/logger");
const config = require("config");
const { createPermissions } = require("../services/permissions.service");
const bcrypt = require("bcrypt");

exports.createUserHandler = async (req, res) => {
  const author = res.locals.user?._id;

  try {
    const permissions = await createPermissions({
      role: req.body.user_role,
      author,
    });
    const user = await createUser({
      ...req.body,
      permissions: permissions._id,
    });
    const created = await findUser({ _id: user._id });
    return res.send(created);
  } catch (err) {
    logger.error("[Conflict]: Account already exist");
    return res.sendStatus(409);
  }
};

exports.updateUserHandler = async (req, res) => {
  const _id = req.params.user_id;

  const update = req.body;

  const user = await findUser({ _id });

  if (!user) return res.sendStatus(404);

  if (String(user._id) !== _id) return res.sendStatus(403);

  const updatedUser = await updateUser(
    { _id },
    { $set: { ...update } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.send(updatedUser);
};

exports.disableAccountHandler = async (req, res) => {
  const _id = res.locals.user._id;

  const user = await findUser({ _id });

  if (!user) return res.sendStatus(404);

  if (String(user._id) === _id) return res.sendStatus(403);

  const disabledUser = await updateUser(
    { _id },
    { $set: { isActive: false } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.sendStatus(disabledUser);
};

exports.getUserHandler = async (req, res) => {
  const _id = req.params.user_id;
  const role = res.locals.user.user_role;
  const region = res.locals.user.region;

  let user = null;

  if (_id === "*") {
    user = await findManyUsers(
      role === "Admin national"
        ? {
            $or: [
              { user_role: "Admin national" },
              { user_role: "Admin provincial" },
            ],
          }
        : role === "Admin provincial"
        ? {
            user_role: "Point focal",
            region,
          }
        : {
            user_role: "None of the above",
          }
    );
  } else {
    user = await findUser({ _id });
  }

  if (!user) return res.sendStatus(404);

  return res.json(user);
};

exports.getLoggedInUserHanlder = async (req, res) => {
  const permission = req.permissions;
  let userData = res.locals.user;
  userData.permissions = permission;
  return res.send(userData);
};

exports.updatePermissionsHandler = async (req, res) => {
  const _id = req.params.user_id;

  const update = req.body;

  const user = await findUser({ _id });

  if (!user) return res.sendStatus(404);

  const updatedUser = await updateUser(
    { _id },
    { $set: { permissions: { ...update } } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.send(updatedUser);
};

exports.changeUserRegion = async (req, res) => {
  const _id = res.locals.user._id;
  const region = req.body.region;

  const updatedUser = await updateUser(
    { _id },
    { $set: { region: region } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );
  res.locals.user.region = region;

  return res.json(updatedUser);
};

exports.resetUserAccount = async (req, res) => {
  const _id = req.params?.user_id;

  const user = await findUser({ _id });

  if (!user) return res.sendStatus(404);

  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(
    (user.email.charAt(0).toUpperCase() + user.email.slice(1)).toString(),
    salt
  );

  await updateUser(
    { _id },
    { $set: { password: hash, isNewUser: true } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.sendStatus(201);
};

exports.deleteUserHandler = async (req, res) => {
  const _id = req.params.user_id;

  const order = await findUser({ _id });

  if (!order) return res.sendStatus(404);

  await deleteUser({ _id });

  return res.send({ _id });
};
