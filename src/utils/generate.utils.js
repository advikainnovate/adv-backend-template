const crypto = require('crypto');

exports.generateStaticOtp = () => {
    return '112211';
};

exports.generateRandomOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};
