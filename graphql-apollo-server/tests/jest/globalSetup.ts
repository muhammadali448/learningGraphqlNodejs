import server from "../../src/server";

export const globalAny: any = global;

module.exports = async () => {
  globalAny.httpServer = await server.start({ port: 4000 });
};
