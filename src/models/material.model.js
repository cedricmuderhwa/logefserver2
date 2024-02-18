const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    marque: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    model: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    plaque: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    chassis: {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    couleur: {
        type: mongoose.Schema.Types.String,
        trim: true,
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

const MaterialModel = mongoose.model('Material', materialSchema)

module.exports = MaterialModel