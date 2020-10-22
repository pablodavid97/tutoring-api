const { createConnection } = require('typeorm');

const connect = async () => {
  let connection = await createConnection();
  return connection;
};

module.exports = connect;
