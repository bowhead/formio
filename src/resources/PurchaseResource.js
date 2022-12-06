'use strict';

const Resource = require('resourcejs');
module.exports = async function(router) {
    const hook = require('../util/hook')(router.formio);
    const handlers = {};
    const handlersPUT = {};

    handlers.before = [
        await router.formio.middleware.validateHash,
        router.formio.middleware.addressHanlder
    ];

    handlersPUT.before = [
        await router.formio.middleware.validateHash,
        router.formio.middleware.addressHanlder,
        await router.formio.middleware.updatePurcharse
    ];

    return Resource(
        router,
        '',
        'purchase',
        router.formio.mongoose.model('purchase')
    ).post(hook.alter('purchaseRoutes', handlers))
    .put(hook.alter('purchaseRoutes', handlersPUT));
};
