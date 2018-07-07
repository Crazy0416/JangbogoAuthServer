const mongoClient = require('mongoose');
const memberSchema = require('./member');

const addressSchema = new mongoClient.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: mongoClient.Schema.ObjectId,
        ref: 'member'
    }]
});

module.exports = mongoClient.model('address', addressSchema);