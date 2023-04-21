'use strict';

module.exports = function(router) {
    return async function buoyantPerson(req, res, next) {
        // Only for get
        if (req.method !== 'GET') {
            return next();
        }
        const modules = [];

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
                Object.keys(person.data.modules).forEach(key => {
                    if (person.data.modules[key]) {
                        modules.push(key);
                    }
                });

                // eslint-disable-next-line camelcase
                req.query.title__in = modules.toString();
            }
        }

        next();
    };
};
