import { usePowerSyncWatchedQuery } from "@powersync/react";
import { Pet } from "../db/AppSchema";
import { Link } from "react-router-dom";

function Watched() {
  const watch = usePowerSyncWatchedQuery<Pet>("SELECT * FROM pets");

  return (
    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      <Link to="/">Homee</Link>
      <div
        style={{
          width: "400px",
          marginBottom: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            backgroundColor: "green",
          }}
        >
          WATCHED PETS
        </p>
        <div>
          {watch?.map((pet: Pet) => (
            <div key={pet.id}>{String(pet.name)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Watched;
