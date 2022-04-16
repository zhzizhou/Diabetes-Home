const mongoose = require('mongoose')

const logItemSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    itemName: { type: String, required: true },
})

const LogItem = mongoose.model('LogItem', logItemSchema)

const logItemDemo = [
    {
        _id: 1,
        itemName: 'Weight',
    },
    {
        _id: 2,
        itemName: 'Insulin Doses',
    },
    {
        _id: 3,
        itemName: 'Exercise Steps',
    },
    {
        _id: 4,
        itemName: 'Blood Glucose Level',
    },
]

module.exports = LogItem
