const { omit, isEmpty } = require('lodash')
const PermissionsModel = require('../models/permissions.model')

exports.createPermissions = async (input) => {
    try {
        const permissions = await PermissionsModel.create(input)
        return omit(permissions.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findPermissions = async (query, options = { lean: true }) => {
    return await PermissionsModel.findById(query, {}, options).populate()
}

exports.findManyPermissionss = async (query, options = { lean: true }) => {
    return await PermissionsModel.find(query, {}, options).populate()
}

exports.updatePermissions = async (query, update, options = { lean: true }) => {
    return await PermissionsModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deletePermissions = async (query) => {
    return await PermissionsModel.findByIdAndDelete(query)
}