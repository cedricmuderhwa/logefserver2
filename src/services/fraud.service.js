const { omit, isEmpty } = require("lodash");
const FraudModel = require("../models/fraud.model");

exports.createFraud = async (input) => {
  try {
    const fraud = await FraudModel.create(input);
    return omit(fraud.toJSON(), "author", "updatedAt");
  } catch (err) {
    throw new Error(err);
  }
};

exports.findFraud = async (query, options = { lean: true }) => {
  return await FraudModel.findById(query, {}, options)
    .populate({ path: "meeting.service" })
    .populate({
      path: "logs",
    })
    .populate({
      path: "signalement.agent signalement.service",
    })
    .populate({ path: "files" })
    .populate({
      path: "prevenus",
      populate: {
        path: "fraudeur",
      },
    })
    .populate({ path: "materials" })
    .populate({ path: "orientation.services_instructeur" })
    .populate({
      path: "substances",
      populate: {
        path: "conditionnement gardiennage",
      },
    })
    .populate({
      path: "invitations",
    });
};

exports.findManyFrauds = async (setting) => {
  const page = parseInt(setting.page);
  const limit = parseInt(setting.limit);
  const searchQuery = setting.search;
  const region = setting.region;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const searchString = new RegExp(searchQuery, "i");

  const total_items = await FraudModel.find(
    searchQuery === "none"
      ? { region }
      : {
          $and: [
            {
              $or: [
                { code: searchString },
                { "signalement.arrest_location": searchString },
              ],
            },
            { region },
          ],
        }
  ).count();

  const results = {};

  if (endIndex < total_items) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  try {
    results.pageCount = Math.ceil(total_items / limit) || 1;
    results.results = await FraudModel.find(
      searchQuery === "none"
        ? { region }
        : {
            $and: [
              {
                $or: [
                  { code: searchString },
                  { "signalement.arrest_location": searchString },
                ],
              },
              { region },
            ],
          }
    )
      .sort({ index: -1 })
      .populate(
        "logs signalement.agent signalement.service files prevenus materials orientation.services_instructeur"
      )
      .populate({
        path: "substances",
        populate: {
          path: "conditionnement gardiennage",
        },
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    return results;
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.findFrauds = async (query, options = { lean: true }) => {
  try {
    return await FraudModel.find(query, {}, options)
      .sort({ index: -1 })
      .populate(
        "logs signalement.agent signalement.service files prevenus materials orientation.services_instructeur"
      )
      .populate({
        path: "substances",
        populate: {
          path: "conditionnement gardiennage",
        },
      });
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.updateFraud = async (query, update, options = { lean: true }) => {
  return await FraudModel.findByIdAndUpdate(query, update, options);
};

exports.deleteFraud = async (query) => {
  return await FraudModel.findByIdAndDelete(query);
};

exports.lastInserted = async () => {
  return await FraudModel.find().sort({ _id: -1 }).limit(1).lean();
};
