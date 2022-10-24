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
            req.body.address = address;
        }

        next();
    };
};
