const mongoose =  require('mongoose')

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    code: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    cases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fraud',
        trim: true
    }],
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const ServiceModel = mongoose.model('Service', serviceSchema)

module.exports = ServiceModel