'use strict';

module.exports = function(router) {
    return async function customSort(req, res, next) {
        if (req.customOrder&& res.resource.status === 200) {
            res.resource.item.sort((a, b) => {
                const aIndex = req.customOrder.findIndex(obj => obj.name === a.title);
                const bIndex = req.customOrder.findIndex(obj => obj.name === b.title);

                return aIndex - bIndex;
            });

            req.customOrder.forEach(element => {
                if (element.alias !== '') {
                    const index = res.resource.item.findIndex(obj => obj.title === element.name);

                    res.resource.item[index].title = element.alias;
                }
            });
        }
        next();
    };
};
