const { omit, isEmpty } = require('lodash')
const PrevenuModel = require('../models/prevenu.model')

exports.createPrevenu = async (input) => {
    try {
        const prevenu = await PrevenuModel.create(input)
        return omit(prevenu.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findPrevenu = async (query, options = { lean: true }) => {
    return await PrevenuModel.findById(query, {}, options).populate('fraudeur')
}

exports.findManyPrevenus = async (query, options = { lean: true }) => {
    return await PrevenuModel.find(query, {}, options).populate('fraudeur')
}

exports.updatePrevenu = async (query, update, options = { lean: true }) => {
    return await PrevenuModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deletePrevenu = async (query) => {
    return await PrevenuModel.findByIdAndDelete(query)
}