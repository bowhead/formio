'use strict';

module.exports = function(router) {
    return function(req, res, next) {
        const signData = {
            hash: req.body.hash,
            sigR: req.body.sigR,
            sigS: req.body.sigS,
            sigV: req.body.sigV
        };

        const address = router.formio.crypto.getAddressFromSign(signData);

        if (address) {
            if (address !== req.user.data.address) {
                return res.status(403).send({
                    message: 'Address does not match with session'
                });
            }

            req.body.address = address;
            req.body.userId = req.user.data.appUserId;
        }
        else {
            return res.status(422).send({
                message: 'Invalid signed message'
            });
        }

        next();
    };
};
