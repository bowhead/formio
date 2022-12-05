'use strict';

module.exports = function(router) {
    return async function(req, res, next) {
        if (req.originalUrl === '/user/login?live=1' || req.isAdmin) {
            return next();
        }

        const address = req.user? req.user.data.address : null;

        if (!address) {
            return res.status(401).send();
        }

        const formFilters = req.query.select? req.query.select.split(','): [];

        if (formFilters.length > 0) {
            if (!formFilters.includes('submissionAccess') && !formFilters.includes('components')
                && !formFilters.includes('access') && !formFilters.includes('owner')) {
                    req.anonymousList = true;
                }
        }

        next();
    };
};
