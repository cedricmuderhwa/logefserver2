const {
  createFraudeur,
  findFraudeur,
  updateFraudeur,
  deleteFraudeur,
  findManyFraudeurs,
} = require("../services/fraudeur.service");

exports.createFraudeurHandler = async (req, res) => {
  const author = res.locals.user._id;
  const body = req.body;

  const fraudeur = await createFraudeur({
    ...body,
    region: res.locals.user.region,
    author,
  });
  res.json(fraudeur);
};

exports.updateFraudeurHandler = async (req, res) => {
  const _id = req.params.fraudeur_id;
  const update = req.body;

  const fraudeur = await findFraudeur({ _id });

  if (!fraudeur) return res.sendStatus(404);

  const updatedFraudeur = await updateFraudeur(
    { _id },
    { $set: { ...update } },
    {
      safe: true,
      upsert: true,
      new: true,
    }
  );

  return res.json(updatedFraudeur);
};

exports.getFraudeurHandler = async (req, res) => {
  const _id = req.params.fraudeur_id;
  const region = res.locals.user.region;

  let fraudeur = null;

  if (_id === "*") {
    fraudeur = await findManyFraudeurs({ region, isNegociant: true });
  } else {
    fraudeur = await findFraudeur({ _id });
  }

  if (!fraudeur) return res.sendStatus(404);

  return res.json(fraudeur);
};

exports.deleteFraudeurHandler = async (req, res) => {
  const _id = req.params.fraudeur_id;
};
