const mongoose =  require('mongoose')

const regionSchema = new mongoose.Schema({
    region: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        index:true,
        unique: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const RegionModel = mongoose.model('Region', regionSchema)

module.exports = RegionModel