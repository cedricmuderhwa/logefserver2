const { omit, isEmpty } = require('lodash')
const RegionModel = require('../models/region.model')

exports.createRegion = async (input) => {
    try {
        const region = await RegionModel.create(input)
        return omit(region.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findRegion = async (query, options = { lean: true }) => {
    return await RegionModel.findById(query, {}, options).populate()
}

exports.findManyRegions = async (query, options = { lean: true }) => {
    return await RegionModel.find(query, {}, options).populate()
}

exports.updateRegion = async (query, update, options = { lean: true }) => {
    return await RegionModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteRegion = async (query) => {
    return await RegionModel.findByIdAndDelete(query)
}