declare module "@sqlite.org/sqlite-wasm" {
  interface SqliteDatabase {
    exec(options: {
      sql: string;
      rowMode: "array";
      columnNames: string[];
      callback: (row: unknown) => false | void;
    }): unknown;
    close(): void;
  }

  interface Sqlite3 {
    oo1: { DB: new (name: string) => SqliteDatabase };
  }

  export default function sqlite3InitModule(options?: {
    locateFile?: (path: string) => string;
  }): Promise<Sqlite3>;
}
