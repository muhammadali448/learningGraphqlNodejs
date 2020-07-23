const { async } = require("regenerator-runtime");

require("@babel/register");
const server = require("../../src/server").default;
module.exports = async () => {
  global.httpServer = await server.start({ port: 4000 });
};
