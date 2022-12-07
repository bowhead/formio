'use strict';

const {v4: uuidv4} = require('uuid');

module.exports = function(router) {
    return async (req, res, next) => {
        const data = req.submission? req.submission.data : req.body.data;

        if (req.originalUrl !== '/user/register') {
            return next();
        }

        if (!data.hash) {
            return next();
        }

        const newAppUserId = uuidv4();

        req.body.data.appUserId = newAppUserId;

        const validHash = await router.formio.mongoose.model('challenge').findOne({
            hash: data.hash,
            expiration: {'$gte': (new  Date()),},
        }).exec();

        if (!validHash) {
            return res.status(422).send({
                message: 'Invalid Hash'
            });
        }

        try {
            const signData = {
                hash: data.hash,
                sigR: data.sigR,
                sigS: data.sigS,
                sigV: Number(data.sigV)
            };

            const address = router.formio.crypto.getAddressFromSign(signData);

            req.body.data.address = address;
        }
        catch (ex) {
            return res.status(422).send({
                message: 'Incorrect signature data'
            });
        }

        return next();
    };
};
