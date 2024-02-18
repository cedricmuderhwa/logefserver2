const mongoose = require('mongoose')

const invitationSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    date_meeting: {
        type: mongoose.Schema.Types.Date,
        required: true,
        trim: true
    },
    time_meeting: {
        type: mongoose.Schema.Types.Date,
        required: true,
        trim: true
    },
    observation: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    report_url: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    service: [{
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    }],
    region : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    strict: true
})

const InvitationModel = mongoose.model('Invitation', invitationSchema)

module.exports = InvitationModel