import { WASQLitePowerSyncDatabaseOpenFactory } from "@powersync/web";
import { AppSchema } from "./AppSchema";
import { SupabaseConnector } from "./Connector";

const factory = new WASQLitePowerSyncDatabaseOpenFactory({
  schema: AppSchema,
  dbFilename: "mydb.sqlite",
});

export const powerSync = factory.getInstance();
export const connector = new SupabaseConnector(); // Uses the backend connector that will be created in the next section

export const setupPowerSync = async () => {
 // await connector.login('tamarafrazzetta@gmail.com', 'admin123')
  await powerSync.init();
  await powerSync.connect(connector);
};
