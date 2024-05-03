import { column, Schema, TableV2 } from "@powersync/web";

export const PETS_TABLE = "pets";
export const CARS_TABLE = "cars";

const pets = new TableV2({
  name: column.text, created_at: column.text,
});

const cars = new TableV2({
  name: column.text, created_at: column.text, user_id: column.text,
});

export const AppSchema = new Schema({pets, cars});

export type Database = (typeof AppSchema)["types"]

export type Pet = Database["pets"]
export type Cars = Database["cars"]

