const mongoose = require('mongoose')

const containerSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    frequency: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true,
        default: 0
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions',
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

const ContainerModel = mongoose.model('Container', containerSchema)

module.exports = ContainerModel