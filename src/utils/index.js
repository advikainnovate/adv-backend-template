const logger = require('./logger');
const bcrypt = require('./bcrypt');
const jwt = require('./jwt');
const { generateStaticOtp, generateRandomOtp } = require('./generate.utils');
const dateUtil = require('./date.utils');
const PGSN = require('./pagination');
const email = require('./email');

module.exports = { logger, bcrypt, jwt, generateOtp: generateStaticOtp, generateStaticOtp, generateRandomOtp, dateUtil, PGSN, email };
