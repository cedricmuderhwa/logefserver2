const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    logs: [{
        date: {
            type: mongoose.Schema.Types.Date,
            trim: true
        },
        step: {
            type: mongoose.Schema.Types.String,
            trim: true
        },
        content: {
            type: mongoose.Schema.Types.String,
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    strict: true
})

const LogModel = mongoose.model('Log', logSchema)

module.exports = LogModel