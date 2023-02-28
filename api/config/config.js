require("dotenv").config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.SERVER,
    port: 1433,
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        encrypt: false, // change to true for local dev / self-signed certs
    }
  }
  module.exports = {
    config,
  };

