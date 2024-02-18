const { omit, isEmpty } = require("lodash");
const AgentModel = require("../models/agent.model");

exports.createAgent = async (input) => {
  try {
    const agent = await AgentModel.create(input);
    return omit(agent.toJSON(), "author", "updatedAt");
  } catch (err) {
    throw new Error(err);
  }
};

exports.findAgent = async (query, options = { lean: true }) => {
  return await AgentModel.findById(query, {}, options).populate(
    "service",
    "service_name"
  );
};

exports.findManyAgents = async (query, options = { lean: true }) => {
  return await AgentModel.find(query, {}, options).populate(
    "service",
    "service_name"
  );
};

exports.updateAgent = async (query, update, options = { lean: true }) => {
  return await AgentModel.findByIdAndUpdate(query, update, options).populate();
};

exports.deleteAgent = async (query) => {
  return await AgentModel.findByIdAndDelete(query);
};
