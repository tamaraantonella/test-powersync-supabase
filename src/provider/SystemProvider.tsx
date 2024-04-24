import { PowerSyncContext } from "@powersync/react";
import React, { useEffect } from "react";
import { SupabaseConnector } from "../db/Connector";
import { connector, powerSync, setupPowerSync } from "../db/client";

const SupabaseContext = React.createContext<SupabaseConnector | null>(null);
export const useSupabase = () => React.useContext(SupabaseContext);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    setupPowerSync()
    //para hacer busquedas raaaaaaaaaaaapido
    //configureFts();
  }, []);

  return (
    <PowerSyncContext.Provider value={powerSync}>
      <SupabaseContext.Provider value={connector}>
        {children}
      </SupabaseContext.Provider>
    </PowerSyncContext.Provider>
  );
};
