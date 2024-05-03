import { useState } from "react";
import { Cars, CARS_TABLE } from "../db/AppSchema.ts";
import { usePowerSync } from "@powersync/react";

export const ByUser = () => {
  const [cars, setCars] = useState<Cars[] | null>(null);
  const powerSync = usePowerSync();

  const handleClick = async () => {
    try {
      const carsFromDb = await powerSync?.getAll<Cars>(`SELECT *
                                                        from ${CARS_TABLE}`);
      setCars(carsFromDb);
      console.log(carsFromDb);
      // setCars(carsFromDb);
    } catch (error) {
      console.error("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };

  return <div>
    <div>Cars only for this user</div>
    <button onClick={handleClick}>Get my cars</button>
    {cars?.map((car) => <div>Cars {car.id}</div>)}
  </div>;
};