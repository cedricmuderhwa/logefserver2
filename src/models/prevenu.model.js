const mongoose = require('mongoose')

const prevenuSchema = new mongoose.Schema({
    fraudeur: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Fraudeur'
    },
    address: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    profession: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    role: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    no_identite : {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    doc_url : {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    isOperator: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false
    },
    isRecidiviste: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Region'
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

const PrevenuModel = mongoose.model('Prevenu', prevenuSchema)

module.exports = PrevenuModel