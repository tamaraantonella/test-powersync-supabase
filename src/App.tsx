import { usePowerSync, usePowerSyncStatus, usePowerSyncWatchedQuery } from "@powersync/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Pet } from "./db/AppSchema";
import { useSupabase } from "./provider/SystemProvider";
import { db } from "./db/client.ts";

function App() {
  const powerSync = usePowerSync();
  const [pets, setPets] = useState<Pet[]>([]);
  const supabase = useSupabase();
  const status = usePowerSyncStatus();
  const queue = usePowerSyncWatchedQuery("SELECT * FROM ps_crud");
  console.log(queue);
  const login = async () => {
    try {
      await supabase?.login("tamarafrazzetta@gmail.com", "admin123");
    } catch (error) {
      console.error("🚀🩷🥰 ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };

  const handleQuery = async () => {
    try {
      const pets = await db.selectFrom("pets").selectAll().execute();
      setPets(pets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  }, [pets, powerSync]);

  return (
    <>
      <Link to="/watched">
        <p>Ir a watched</p>
      </Link><Link to="/by-user">
      <p>Ir a by user</p>
    </Link>

      <div style={{ marginBottom: "15px", marginTop: "25px" }}>
        Connected: {status.connected ? "wifi" : "wifi-off"}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={login}>Login</button>
        <button onClick={handleQuery}>Get Pets</button>
      </div>

      <div>
        {pets?.map((pet: Pet) => (
          <div
            key={pet.id}
            style={{ display: "flex", gap: "15px", alignItems: "center" }}
          >
            <p>{String(pet.name)}</p>
            <button
              onClick={async () => {
                try {
                  await db.deleteFrom("pets").where("id", "=", pet.id).execute();
                } catch (ex: unknown) {
                  console.error(ex);
                }
              }}
            >
              Delete
            </button>
            <button
              onClick={async () => {
                try {
                  await db.updateTable("pets").where("id", "=", pet.id).set("name", `${pet.name}.new`).execute();
                } catch (ex: unknown) {
                  console.error(ex);
                }
              }}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
