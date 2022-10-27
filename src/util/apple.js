'use strict';

const axios = require('axios');
const config = require('config');

module.exports = function() {
    return {
        async verify(purchase) {
            const body = {
                'receipt-data': purchase.token,
                'password': purchase.password,
                'exclude-old-transactions': true
            };

            try {
                const data = await axios.post(config.iosVerifyReceipt, body);

                return {
                    valid: true,
                    data: data,
                    message: undefined,
                    status: data.status
                };
            }
            catch (error) {
                const status = error.response.status | 500;

                return {
                    valid: false,
                    data: undefined,
                    message: status,
                    status
                };
            }
        }
    };
};
