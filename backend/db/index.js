const snowflake = require("snowflake-sdk");
const config = require("../config/config");

const connection = snowflake.createConnection(config);

connection.connect((err, conn) => {
    if(err) {
        console.log("This is the err:", err);
    } else {
        console.log("Successfully connected as id:", connection.getId());
    }
});
