'use strict';

module.exports = (router) => async (req, res, next) => {
    if (req.originalUrl === '/user/login?live=1' || req.isAdmin || req.anonymousList) {
        return next();
    }

    let moduleName = '';

    const address = req.user.data.address;

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
