const mysql = require("mysql2");
require("dotenv").config();
const Pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 // Sin límites
});

module.exports = Pool;