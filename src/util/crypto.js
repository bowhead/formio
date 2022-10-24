'use strict';

const crypto = require('crypto');
const sha3 = require('sha3');
const ethereumjs = require('ethereumjs-util');

module.exports = function(formio) {
    return {
        async challengeHash(ip, address) {
            const rndValue = crypto.randomBytes(12).toString('hex');
            // eslint-disable-next-line max-len
            const data = `1500${ip.replace(/[.:]/g, '')}${address.replace('0x', '')}${(new Date()).getTime()}${rndValue}`;
            const shaKeccak = new sha3.Keccak(256);
            const hash = shaKeccak.update(Buffer.from(data, 'hex')).digest({buffer: Buffer.alloc(32), format: 'hex'});

            return hash;
        },
        getAddressFromSign(signData) {
            const bufferHash = Buffer.from(signData.hash, 'hex');
            const r = Buffer.from(signData.sigR, 'hex');
            const s = Buffer.from(signData.sigS, 'hex');

            const pub = ethereumjs.ecrecover(bufferHash, signData.sigV, r, s);

            const recoveredAddress = `0x${ethereumjs.pubToAddress(pub).toString('hex')}`;

            return recoveredAddress;
        }
    };
};
