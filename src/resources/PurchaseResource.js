'use strict';

const Resource = require('resourcejs');
module.exports = async function(router) {
    const hook = require('../util/hook')(router.formio);
    const handlers = {};

    handlers.before = [
        await router.formio.middleware.validateHash,
        router.formio.middleware.addressHanlder
    ];

    return Resource(
        router,
        '',
        'purchase',
        router.formio.mongoose.model('purchase')
    ).post(hook.alter('purchaseRoutes', handlers));
};
