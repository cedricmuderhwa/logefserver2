const { omit, isEmpty } = require('lodash')
const InvitationModel = require('../models/invitation.model')

exports.createInvitation = async (input) => {
    try {
        const invitation = await InvitationModel.create(input)
        return omit(invitation.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findInvitation = async (query, options = { lean: true }) => {
    return await InvitationModel.findById(query, {}, options).populate()
}

exports.findManyInvitations = async (query, options = { lean: true }) => {
    return await InvitationModel.find(query, {}, options).populate()
}

exports.updateInvitation = async (query, update, options = { lean: true }) => {
    return await InvitationModel.findByIdAndUpdate(query, update, options).populate()
}

exports.deleteInvitation = async (query) => {
    return await InvitationModel.findByIdAndDelete(query)
}