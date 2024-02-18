const mongoose =  require('mongoose')

const substanceSchema = new mongoose.Schema({
    nature: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    filiere: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    weight: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    colis: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    teneur: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    unit: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    valeur_de_base: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    valeur_marchande: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    conditionnement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Container',
        trim: true,
        required: true
    },
    gardiennage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        trim: true,
        required: true
    },
    consignation: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true
    },
    chemical_formula: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: false
    },
    fraud_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fraud',
        trim: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const SubstanceModel = mongoose.model('Substance', substanceSchema)

module.exports = SubstanceModel