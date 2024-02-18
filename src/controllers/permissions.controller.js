const {
  createPermissions,
  findPermissions,
  updatePermissions,
  deletePermissions,
  findManyPermissionss,
} = require("../services/permissions.service");
const { findUser } = require("../services/user.service");

exports.createPermissionHandler = async (req, res) => {
  const author = res.locals.user._id;
  const body = req.body;

  try {
    const permissions = await createPermissions({ ...body, author });
    return res.json(permissions);
  } catch (error) {
    return res.status(500).json({
      error_code: 500,
      message: error.message,
    });
  }
};

exports.updatePermissionHandler = async (req, res) => {
  const _id = req.params.user_id;
  const update = req.body;

  const user = await findUser({ _id });

  if (!user) return res.sendStatus(404);

  const permissions = await findPermissions({ _id: user.permissions._id });

  if (!permissions) return res.sendStatus(404);

  await updatePermissions(
    { _id: permissions._id },
    { $set: { ...update } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  const updatedUser = await findUser({ _id });

  return res.json(updatedUser);
};

exports.getPermissionHandler = async (req, res) => {
  const _id = req.params.permission_id;

  let permission = null;

  if (_id === "*") {
    permission = await findManyPermissions({});
  } else {
    permission = await findPermission({ _id });
  }

  if (!permission) return res.sendStatus(404);

  return res.json(permission);
};

exports.deletePermissionHandler = async (req, res) => {
  const _id = req.params.permissions_id;

  const permissions = await findPermissions({ _id });

  if (!permissions) return res.sendStatus(404);

  await deletePermissions({ _id });

  return res.send({ _id });
};
