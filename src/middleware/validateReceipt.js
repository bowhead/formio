'use strict';
const apple = require('../util/apple');
const android = require('../util/google');

module.exports = function(router) {
    return async function(req, res, next) {
        const signData = {
            hash: req.headers.hash,
            sigR: req.headers.sigR,
            sigS: req.headers.sigS,
            sigV: req.headers.sigV
        };

        const address = router.formio.crypto.getAddressFromSign(signData);

        if (!address) {
            return res.status(422).send({
                message: 'Invalid signed message'
            });
        }

        const purchase = await router.formio.mongoose.model('challenge').findOne({
            address: address
        }).exec();

        if (!purchase) {
            return res.status(422).send({
                message: 'User without subscription registered'
            });
        }

        try {
            const iosVerification = apple.verify(purchase);
            const androidVerification = android.verify(purchase);

            if (iosVerification.valid || androidVerification.valid) {
                return next();
            }
            else {
                return res.status().send({
                    message: 'Subscription expired'
                });
            }
        }
        catch (error) {
            return res.status().send({
                message: 'Subscription expired'
            });
        }
    };
};
