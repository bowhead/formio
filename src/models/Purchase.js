'use strict';
const _ = require('lodash');

module.exports = function(formio) {
    const hook = require('../util/hook')(formio);

    /**
     * The Schema for Purchase.
     *
     * @type {exports.Schema}
     */
    const PurchaseSchema = hook.alter('purchaseSchema', new formio.mongoose.Schema({
        address: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: ['normal', 'trial'],
            default: 'normal'
        },
        module: {
            type: String
        },
        platform: {
            type: String,
            required: true,
            enum: ['ios', 'android']
        }
    }));

    const model = require('./BaseModel')({
        schema: PurchaseSchema
    });

    return model;
};
