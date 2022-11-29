'use strict';

module.exports = function(formio) {
    const hook = require('../util/hook')(formio);

    /**
     * The Schema for Challenge.
     *
     * @type {export.Schema}
     */
    const ChallengeSchema = hook.alter('challengeSchema', new formio.mongoose.Schema({
        hash: {
            type: String,
            required: true,
            index: true
        },
        address: {
            type: String,
            required: true,
            index: true
        },
        expiration: {
            type: Date,
            required: true
        },
        source: {
            type: String,
            required: true
        }
    }));

    const model = require('./BaseModel')({
        schema: ChallengeSchema
    });

    return model;
};
