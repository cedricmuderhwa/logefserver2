const { omit, isEmpty } = require("lodash");
const LogModel = require("../models/logs.model");

exports.createLog = async (input) => {
  try {
    const log = await LogModel.create(input);
    return omit(log.toJSON(), "author", "updatedAt");
  } catch (err) {
    throw new Error(err);
  }
};

exports.findLog = async (query, options = { lean: true }) => {
  return await LogModel.findById(query, {}, options).populate();
};

exports.findManyLogs = async (query, options = { lean: true }) => {
  return await LogModel.find(query, {}, options).limit(16).lean();
};

exports.updateLog = async (query, update, options = { lean: true }) => {
  return await LogModel.findByIdAndUpdate(query, update, options).populate();
};

exports.deleteLog = async (query) => {
  return await LogModel.findByIdAndDelete(query);
};
