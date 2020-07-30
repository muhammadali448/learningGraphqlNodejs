const server = require("../../src/server").default;

export const globalAny: any = global;

module.exports = async () => {
  globalAny.httpServer = await server.start({ port: 4000 });
};
