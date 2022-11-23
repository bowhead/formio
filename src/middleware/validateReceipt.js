'use strict';
const revenueCat = require('../util/revenuecat');

module.exports = function(router) {
    return async function(req, res, next) {
        if (req.originalUrl === '/user/login?live=1' || req.isAdmin) {
            return next();
        }

        const address = req.user.data.address;

        if (!address) {
            return res.status(422).send({
                message: 'Invalid signed message'
            });
        }

        const purchase = await router.formio.mongoose.model('purchase').findOne({
            address: address
        }).exec();

        if (!purchase) {
            return res.status(422).send({
                message: 'User without subscription registered'
            });
        }

        try {
            const renevueCatVerification = await revenueCat().verify(purchase);

            if (renevueCatVerification.valid) {
                return next();
            }
            else {
                console.log('expired');
                return res.status(404).send({
                    message: 'Subscription expired'
                });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(404).send({
                message: 'Subscription expired'
            });
        }
    };
};
