'use strict';

module.exports = function(router) {
    return async function(req, res, next) {
        const validHash = await router.formio.mongoose.model('challenge').findOne({
            hash: req.body.hash,
            expiration: {'$gte': (new  Date()),},
        }).exec();

        if (validHash) {
            return next();
        }
        else {
            return res.status(422).send({
                message: 'Invalid Hash'
            });
        }
    };
};
