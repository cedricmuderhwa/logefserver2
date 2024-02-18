const { omit, isEmpty } = require('lodash')
const SubstanceModel = require('../models/substance.model')

exports.createSubstance = async (input) => {
    try {
        const substance = await SubstanceModel.create(input)
        return omit(substance.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findSubstance = async (query, options = { lean: true }) => {
    return await SubstanceModel.findById(query, {}, options).populate()
}

exports.findManySubstances = async (query, options = { lean: true }) => {
    return await SubstanceModel.find(query, {}, options).populate()
}

exports.updateSubstance = async (query, update, options = { lean: true }) => {
    return await SubstanceModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteSubstance = async (query) => {
    return await SubstanceModel.findByIdAndDelete(query)
}