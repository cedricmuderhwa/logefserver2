const { omit, isEmpty } = require('lodash')
const StatModel = require('../models/stats.model')

exports.createStat = async (input) => {
    try {
        const stat = await StatModel.create(input)
        return omit(stat.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findStat = async (query, options = { lean: true }) => {
    return await StatModel.findOne(query, {}, options).populate()
}

exports.findManyStats = async (query, options = { lean: true }) => {
    return await StatModel.find(query, {}, options).populate()
}

exports.updateStat = async (query, update, options = { lean: true }) => {
    return await StatModel.findOneAndUpdate(query, update, options).populate()
}

exports.deleteStat = async (query) => {
    return await StatModel.findOneAndDelete(query)
}