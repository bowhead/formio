'use strict';

module.exports = function(router) {
    return async function(req, res, next) {
        const address = req.body.address;

        const purchase = await router.formio.mongoose.model('purchase').findOne({
            address: address
        }).exec();

        if (purchase) {
            req.params.purchaseId = purchase._id;
        }
        else {
            return res.status(404).send({
                message: 'Non subscriptions'
            });
        }

        next();
    };
};
