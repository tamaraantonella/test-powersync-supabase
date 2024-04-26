import { usePowerSync, usePowerSyncStatus } from "@powersync/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { PETS_TABLE, Pet } from "./db/AppSchema";
import { useSupabase } from "./provider/SystemProvider";

function App() {
  const powerSync = usePowerSync();
  const [pets, setPets] = useState<Pet[]>([]);
  const supabase = useSupabase();
  const status = usePowerSyncStatus();

  const login = async () => {
    try {
      await supabase?.login("tamarafrazzetta@gmail.com", "admin123");
    } catch (error) {
      console.error("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };

  const handleQuery = async () => {
    try {
      const pets = await powerSync?.getAll<Pet>(`SELECT * from ${PETS_TABLE}`);
      setPets(pets);
    } catch (error) {
      console.error("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };
  useEffect(() => {}, [pets, powerSync]);

  return (
    <>
      <Link to="/watched">
        <p>Ir a watched</p>
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
                  await powerSync.execute(
                    `DELETE FROM ${PETS_TABLE} WHERE id = ?`,
                    [pet.id]
                  );
                } catch (ex: any) {
                  alert("Error: " + ex.message);
                }
              }}
            >
              Delete
            </button>
            <button
              onClick={async () => {
                try {
                  await powerSync.execute(
                    `UPDATE ${PETS_TABLE} SET name = ? WHERE id = ?`,
                    [`${pet.name}2`, pet.id]
                  );
                } catch (ex: any) {
                  alert("Error: " + ex.message);
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
