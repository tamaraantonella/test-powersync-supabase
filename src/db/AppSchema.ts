import { Column, ColumnType, Schema, Table } from "@powersync/web";

export const AppSchema = new Schema([
  new Table({
    name: 'pets',
    columns: [
      new Column({ name: 'created_at', type: ColumnType.TEXT }),
      new Column({ name: 'name', type: ColumnType.TEXT })
    ]
  })
])


