'use strict';

const axios = require('axios');
require('dotenv').config();

module.exports = function() {
    return {
        async verify(purchase) {
            try {
                const config = {
                    'headers': {
                        'authorization': `Bearer ${process.env.REVENUE_CAT_API_KEY}`
                    }
                };

                const data = await axios.get(`https://api.revenuecat.com/v1/subscribers/${purchase.userId}`, config);

                const subscriber = data.data.subscriber;
                const entitlementKeys = Object.keys(subscriber.entitlements);

                if (entitlementKeys.length > 0) {
                    const subscriptionData = subscriber.entitlements[entitlementKeys[0]];
                    const expiresDate = new Date(subscriptionData.expires_date);
                    if (expiresDate > new Date()) {
                        return {
                            valid: true,
                            data: subscriber.entitlements,
                            message: undefined,
                            status: 200
                        };
                    }
                    else {
                        return {
                            valid: false,
                            data: subscriber,
                            message: 'Subscription expired',
                            status: 404
                        };
                    }
                }
                else {
                    return {
                        valid: false,
                        data: subscriber,
                        message: 'Non subscriptions',
                        status: 404
                    };
                }
            }
            catch (error) {
                const status = error.code | 500;

                return {
                    valid: false,
                    data: undefined,
                    message: error.message | undefined,
                    status: status
                };
            }
        }
    };
};
