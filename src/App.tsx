import { usePowerSync } from "@powersync/react";
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { useSupabase } from "./provider/SystemProvider";
import viteLogo from "/vite.svg";

function App() {
  const powerSync = usePowerSync();
  const [pets, setPets] = useState<unknown[]>([]);

  const supabase = useSupabase();

  const login = async () => {
    try {
      await supabase?.login("tamarafrazzetta@gmail.com", "admin123");
    } catch (error) {
      console.log("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };

  const handleQuery = () => {
    try {
      powerSync?.getAll("SELECT * from pets")
        .then((value) => {
          setPets(value)
        });

    } catch (error) {
      console.log("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <button onClick={login}>Login</button>
      <button onClick={handleQuery}>Pets</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

    </>
  );
}

export default App;
