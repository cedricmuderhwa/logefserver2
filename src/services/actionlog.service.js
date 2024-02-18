const { omit, isEmpty } = require('lodash')
const ActionLogModel = require('../models/actionlogs.model')

exports.createActionLog = async (input) => {
    try {
        const actionlog = await ActionLogModel.create(input)
        return omit(actionlog.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findActionLog = async (query, options = { lean: true }) => {
    return await ActionLogModel.findById(query, {}, options).populate()
}

exports.findManyActionLogs = async (query, options = { lean: true }) => {
    return await ActionLogModel.find(query, {}, options).populate()
}

exports.updateActionLog = async (query, update, options = { lean: true }) => {
    return await ActionLogModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteActionLog = async (query) => {
    return await ActionLogModel.findByIdAndDelete(query)
}