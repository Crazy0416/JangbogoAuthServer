/*
const mongoClient = require('mongoose');
const memberSchema = require('./member');

const tagSchema = new mongoClient.Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    memberArr: [{
        type: mongoClient.Schema.ObjectId,
        ref: 'member'
    }]
});

tagSchema.statics.findTag = function(tag, cb)  {
    return this.find({tag: tag}, cb);
};

tagSchema.methods.updateTagMember = function(member) {

};

module.exports = mongoClient.model('tag', tagSchema);
*/