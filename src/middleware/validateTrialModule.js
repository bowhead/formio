'use strict';

module.exports = (router) => async (req, res, next) => {
    let moduleName = '';

    const signData = {
        hash: req.headers.hash,
        sigR: req.headers.sigr,
        sigS: req.headers.sigs,
        sigV: Number(req.headers.sigv)
    };

    const address = router.formio.crypto.getAddressFromSign(signData);

    const purchase = await router.formio.mongoose.model('purchase').findOne({
        address: address
    }).exec();

    if (req.formId) {
        const form = await router.formio.mongoose.model('form').findOne({
            _id: req.formId
        });

        if (form) {
            moduleName = form.name;
        }
    }
    else if (req.query.name) {
        moduleName = req.query.name;
    }

    if (purchase.type === 'trial') {
        if (moduleName === purchase.module) {
            return next();
        }
        else {
            return res.status(403).send({
                message: 'Forbidden module'
            });
        }
    }
    else {
        return next();
    }
};
