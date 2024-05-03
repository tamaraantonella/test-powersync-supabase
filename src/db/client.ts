import { WASQLitePowerSyncDatabaseOpenFactory } from "@powersync/web";
import { AppSchema, Database } from "./AppSchema";
import { SupabaseConnector } from "./Connector";
import { wrapPowerSyncWithKysely } from "@powersync/kysely-driver";

const factory = new WASQLitePowerSyncDatabaseOpenFactory({
  schema: AppSchema,
  dbFilename: "mydb.sqlite",
});

export const powerSyncDb = factory.getInstance();
export const db = wrapPowerSyncWithKysely<Database>(powerSyncDb);
export const connector = new SupabaseConnector(); // Uses the backend connector that will be created in the next section

export const setupPowerSync = async () => {
  // await connector.login('tamarafrazzetta@gmail.com', 'admin123')
  await powerSyncDb.init();
  await powerSyncDb.connect(connector);
};
