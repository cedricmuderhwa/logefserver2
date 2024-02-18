const { omit, isEmpty } = require('lodash')
const ContainerModel = require('../models/container.model')

exports.createContainer = async (input) => {
    try {
        const container = await ContainerModel.create(input)
        return omit(container.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findContainer = async (query, options = { lean: true }) => {
    return await ContainerModel.findById(query, {}, options).populate()
}

exports.findManyContainers = async (query, options = { lean: true }) => {
    return await ContainerModel.find(query, {}, options).populate()
}

exports.updateContainer = async (query, update, options = { lean: true }) => {
    return await ContainerModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteContainer = async (query) => {
    return await ContainerModel.findByIdAndDelete(query)
}