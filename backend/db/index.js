const snowflake = require("snowflake-sdk");
const config = require("../config/config");

const snowFlake = snowflake.createConnection(config);

module.exports = snowFlake; 


