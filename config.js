/**
 * This file will be used get the config value from .env file
 */

const path = require('path');
const dotenv = require('dotenv');
// Hook the .env file
dotenv.config({path: path.join(__dirname , ".env")});

/**
 * This function will return the value of variable in the .env file
 *
 * @param param
 * @returns {any}
 */
module.exports = (param) => {
    return process.env[param]? process.env[param] : null;
}