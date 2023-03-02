'use strict';

/**
 * Middleware to get image and color separated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function(router) {
    return function lightestList(req, res, next) {
        // Only for get
        if (req.method !== 'GET') {
            return next();
        }

        const formFilters = req.query.select? req.query.select.split(','): [];

        if (formFilters.includes('image') || formFilters.includes('color')) {
            res.resource.item.forEach(function(part, index) {
                if (this[index].components && this[index].components.length > 0) {
                    if (this[index].components[0].key === 'HOME') {
                        if (formFilters.includes('image')) {
                            this[index].image = this[index].components[0].components[0].components[1].attrs[0].value;
                        }

                        if (formFilters.includes('color')) {
                            this[index].color = this[index].components[0].components[0].components[4].defaultValue;
                        }
                    }
                }

                if (req.anonymousList) {
                    delete this[index].components;
                }
                else if (req.removeComponents) {
                    delete this[index].components;
                }
              }, res.resource.item);
        }

        next();
    };
};
