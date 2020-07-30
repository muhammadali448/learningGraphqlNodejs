import { globalAny } from "./globalSetup";
module.exports = async () => {
  await globalAny.httpServer.close();
};
