const { omit, isEmpty } = require('lodash')
const MaterialModel = require('../models/material.model')

exports.createMaterial = async (input) => {
    try {
        const material = await MaterialModel.create(input)
        return omit(material.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findMaterial = async (query, options = { lean: true }) => {
    return await MaterialModel.findById(query, {}, options).populate()
}

exports.findManyMaterials = async (query, options = { lean: true }) => {
    return await MaterialModel.find(query, {}, options).populate()
}

exports.updateMaterial = async (query, update, options = { lean: true }) => {
    return await MaterialModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteMaterial = async (query) => {
    return await MaterialModel.findByIdAndDelete(query)
}