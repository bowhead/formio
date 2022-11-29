'use strict';

const {JWT} = require('google-auth-library');
const googleConfiguration = require('../../config/firebase/buoyant.json');

module.exports = function() {
    return {
        async verify(purchase) {
            const client = new JWT({
                email: googleConfiguration.client_email,
                key: googleConfiguration.private_key,
                scopes: ['https://www.googleapis.com/auth/androidpublisher']
            });

            try {
                const data = await client.request({
                    method: 'GET',
                    url: `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${purchase.packageName}/purchases/subscriptions/${purchase.subscriptionId}/tokens/${purchase.token}`
                });

                if (data.status === 410) {
                    return {
                        valid: false
                    };
                }

                return {
                    valid: true,
                    message: undefined,
                    status: data.status
                };
            }
            catch (error) {
                return {
                    valid: false,
                    message: error.message
                };
            }
        }
    };
};
