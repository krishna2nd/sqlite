import "tslib";
import * as sqlite3 from "sqlite3";

const sqlite: sqlite3.sqlite3 = sqlite3.verbose();
const dbName = "mtm.sqlite3";

class MTMDataStoreConfig {
    public db: sqlite3.Database;
    constructor() {
        this.db = new sqlite.Database(dbName);
        this.setup();
    }
    public setup() {
        this.db.run(`CREATE TABLE IF NOT EXISTS "TAGS" (
            "ID"	INTEGER PRIMARY KEY AUTOINCREMENT,
            "DATA"	TEXT NOT NULL
        );`);
        this.db.run(`CREATE TABLE IF NOT EXISTS "TRIGGERS" (
           "ID" INTEGER PRIMARY KEY AUTOINCREMENT,
            "DATA" TEXT NOT NULL
         );`);
        this.db.run(`CREATE TABLE  IF NOT EXISTS "VARIABLES" (
            "ID" INTEGER PRIMARY KEY AUTOINCREMENT,
            "DATA" TEXT NOT NULL
         );`);
    }
    public close() {
        this.db.close();
    }
}

export default class MTMDataStore {
    private store: MTMDataStoreConfig;
    private static instance: MTMDataStore;
    private constructor() {
        this.store = new MTMDataStoreConfig();
    }
    public static getInstance() {
        if (!MTMDataStore.instance) {
            MTMDataStore.instance = new MTMDataStore()
        }
        return MTMDataStore.instance;
    }
    public Select(selectQuery: string, ...params: any[]) {
        return this.Execute('get', selectQuery, ...params);
    }
    public SelectAll(selectQuery: string, ...params: any[]) {
        return this.Execute('all', selectQuery, ...params);
    }
    public async Insert(insertQuery: string, ...params: any[]) {
        await this.Execute('run', insertQuery, ...params);
        // OR select seq from sqlite_sequence where name="table_name"
        return await this.Execute('get', `SELECT last_insert_rowid() as ID`);
    }
    public Delete(deleteQuery: string, ...params: any[]) {
        return this.Execute('run', deleteQuery, ...params);
    }

    public async Execute(action: string, query: string, ...params: any[]) {
        return new Promise((resolve, reject) => {
            const statement: sqlite3.Statement = this.store.db.prepare(query, (err) => {
                if (err) return reject(err);
            });
            statement[action](...params, (err, ...data) => {
                if (err) return reject(err)
                resolve(...data)
            })
            statement.finalize();
        });
    }
    public Close() {
        this.store.db.close();
    }
}
