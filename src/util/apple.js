'use strict';

const axios = require('axios');
const config = require('config');
require('dotenv').config();

module.exports = function() {
    return {
        async verify(purchase) {
            const body = {
                'receipt-data': purchase.token,
                'password': process.env.IOS_APP_TOUCH_PASS,
                'exclude-old-transactions': false
            };

            try {
                const data = await axios.post(config.iosVerifyReceipt, body);

                if (data.data.status === 0) {
                    return {
                        valid: true,
                        data: data,
                        message: undefined,
                        status: data.status
                    };
                }
                else {
                    return {
                        valid: false,
                        data: data.data,
                        message: undefined,
                        status: data.status
                    };
                }
            }
            catch (error) {
                const status = error.response.status | 500;

                return {
                    valid: false,
                    data: undefined,
                    message: status,
                    status: status
                };
            }
        }
    };
};
