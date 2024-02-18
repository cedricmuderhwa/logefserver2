const { omit, isEmpty } = require('lodash')
const PvsModel = require('../models/pvs.model')

exports.createPvs = async (input) => {
    try {
        const pvs = await PvsModel.create(input)
        return omit(pvs.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findPv = async (query, options = { lean: true }) => {
    return await PvsModel.findById(query, {}, options).populate()
}

exports.findManyPvs = async (query, options = { lean: true }) => {
    return await PvsModel.find(query, {}, options).populate()
}

exports.updatePvs = async (query, update, options = { lean: true }) => {
    return await PvsModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deletePvs = async (query) => {
    return await PvsModel.findByIdAndDelete(query)
}