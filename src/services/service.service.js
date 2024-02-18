const { omit, isEmpty } = require('lodash')
const ServiceModel = require('../models/service.model')

exports.createService = async (input) => {
    try {
        const service = await ServiceModel.create(input)
        return omit(service.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findService = async (query, options = { lean: true }) => {
    return await ServiceModel.findById(query, {}, options).populate()
}

exports.findManyServices = async (query, options = { lean: true }) => {
    return await ServiceModel.find(query, {}, options).populate()
}

exports.updateService = async (query, update, options = { lean: true }) => {
    return await ServiceModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteService = async (query) => {
    return await ServiceModel.findByIdAndDelete(query)
}