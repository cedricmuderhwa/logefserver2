const { omit, isEmpty } = require('lodash')
const FraudeurModel = require('../models/fraudeur.model')

exports.createFraudeur = async (input) => {
    try {
        const fraudeur = await FraudeurModel.create(input)
        return omit(fraudeur.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findFraudeur = async (query, options = { lean: true }) => {
    return await FraudeurModel.findById(query, {}, options)
}

exports.findManyFraudeurs = async (query, options = { lean: true }) => {
    return await FraudeurModel.find(query, {}, options).populate('region', 'region')
}

exports.updateFraudeur = async (query, update, options = { lean: true }) => {
    return await FraudeurModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteFraudeur = async (query) => {
    return await FraudeurModel.findByIdAndDelete(query)
}