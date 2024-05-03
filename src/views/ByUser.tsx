import { useState } from "react";
import { Cars } from "../db/AppSchema.ts";
import { connector, db } from "../db/client.ts";

export const ByUser = () => {
  const [cars, setCars] = useState<Cars[] | null>(null);
  const handleGetCars = async () => {
    try {
      const carsFromDb = await db.selectFrom("cars").selectAll().execute();
      setCars(carsFromDb);
      // setCars(carsFromDb);
    } catch (error) {
      console.error("🚀🩷🥰​ ~ file: App.tsx:20 ~ login ~ error", error);
    }
  };
  const getOnlyMyCars = async () => {

    try {
      const { data } = await connector.client.auth.getUser();
      if(!data.user) return;

      const myCars = await db.selectFrom("cars").selectAll().where("user_id", "=", data.user.id).execute();
      setCars(myCars);
    } catch (e) {
      console.error(e);
    }
  };

  return <div>
    <div>User's Cars and cars without userId</div>
    <button onClick={handleGetCars}>Get my cars and others</button>
    <button onClick={getOnlyMyCars}>Get only my cars</button>
    {cars?.map((car) => <div key={car.id} style={{ display: "flex", gap: "5px" }}>
      <p>CarId: {car.id}</p>
      <p>{car.name}</p>
      <p>UserId: {car.user_id ? car.user_id : "No tiene"}</p>
    </div>)}
  </div>;
};