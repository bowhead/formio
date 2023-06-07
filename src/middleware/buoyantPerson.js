'use strict';

module.exports = function(router) {
    return async function buoyantPerson(req, res, next) {
        // Only for get
        if (req.method !== 'GET') {
            return next();
        }
        const modules = [];
        const customOrder = [];

        if (req.query.person) {
            const buoyantForm = await router.formio.resources.form.model.findOne({
                name: 'buoyantPerson'
            }).exec();

            const formId = buoyantForm._id;

            const person = await router.formio.resources.submission.model.findOne({
                'form': formId,
                'data.type': req.query.person
            }).exec();

            if (person) {
                person.data.modules.forEach(item => {
                    modules.push(item.modulesName);
                    customOrder.push({
                        name: item.modulesName,
                        order: item.modulesPosition,
                        alias: item.modulesAlias || ''
                    });
                });

                customOrder.sort((a, b) => a.order - b.order);
                // eslint-disable-next-line camelcase
                req.query.title__in = modules.toString();
                req.customOrder = customOrder;
            }
        }

        next();
    };
};
