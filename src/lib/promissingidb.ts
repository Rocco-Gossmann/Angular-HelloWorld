export class PromissingIDBConstructionError extends Error { }
export class PromissingIDBError extends Error { }

export type PromissingIDBCursorDirection = "next"|"nextunique"|"prev"|"prevunique" ;

export class PromissingIDBCursor<T> {
  private cur: IDBCursorWithValue;

  get key()        : IDBValidKey             { return this.cur.key }
  get primaryKey() : IDBValidKey             { return this.cur.primaryKey }
  get value()      : T                       { return this.cur.value }
  get source()     : IDBObjectStore|IDBIndex { return this.cur.source }
  get request()    : IDBRequest              { return this.cur.request }
  get direction()  : IDBCursorDirection      { return this.cur.direction }

  advance: (count: number) => void = () => {};
  continuePrimaryKey: (key: IDBValidKey, primaryKey: IDBValidKey) => void = () => {};

  constructor(cur: IDBCursorWithValue) {
    this.cur = cur;
    this.advance = this.cur.advance;
    this.continuePrimaryKey = this.cur.continuePrimaryKey;
  }

  /** Update the dataset at the current primaryKey with the new data */
  update(obj: any): Promise<IDBValidKey> {
    return new Promise( (resolve, reject) => {
      const req = this.cur.update(obj);
      req.onsuccess = () => resolve(req.result);
      req.onerror =   () => reject(req.error);
    })
  }

  /** Move on to the next row */
  continue(): Promise<PromissingIDBCursor<T>|null> {
    return new Promise( (resolve, reject) => {
      this.cur.request.onsuccess = () => resolve(this.cur.request?.result ? this : null);
      this.cur.request.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
      this.cur.continue()
    })
  }

  delete(): Promise<undefined> {
    return new Promise( (resolve, reject) => {
      const req = this.cur.delete();
      req.onsuccess = () => resolve(req.result);
      req.onerror =   () => reject(req.error);
    })
  }
}

export class PromissingIDBStore {
  private _store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
      this._store = store;
  }

  /** Adds an Item into the database, should an item with a given key already exist
  * the Promise is rejected
  */
  add(obj: any, key?: IDBValidKey): Promise<IDBValidKey>       {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.add(obj, key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** delete all data from the store */
  clear(): Promise<undefined>         {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.clear();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /**
   * get the muber of elements in the store
   * @param {IDBKeyRange} [query]  - limit the elements counted by key
   */
  count(query?: IDBKeyRange): Promise<number>            {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.count(query);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** Deletes the data with the given Key or KeyRange */
  delete(key: IDBKeyRange|IDBValidKey): Promise<undefined>         {

    if(!(key instanceof IDBKeyRange))
      key = IDBKeyRange.only(key);

    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.delete(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }


  /** Gets one dataset, that has the given key */
  get(key: IDBValidKey): Promise<any|undefined>  {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.get( key );
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** Retrieves the key of the first record matching the given key or key range in query. */
  getKey(key: IDBKeyRange|IDBValidKey): Promise<IDBValidKey|undefined>       {
    if(!(key instanceof IDBKeyRange))
      key = IDBKeyRange.only(key);

    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.getKey(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** Like `get` but returns all found results, instead of only the first */
  getAll(query?: IDBKeyRange, count?: number): Promise<any[]>       {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.getAll( query, count );
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** Like `getKey` but returns all found keys, instead of only the first */
  getAllKeys(query?: IDBKeyRange, count?: number): Promise<any>       {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.getAllKeys( query, count );
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  openCursor<T>(query?: IDBKeyRange, direction?: PromissingIDBCursorDirection): Promise<PromissingIDBCursor<T>|null>       {
    console.warn("TODO: Research")
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.openCursor( query, direction);
        req.onsuccess = () => resolve(req.result ? new PromissingIDBCursor(req.result) : null);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  openKeyCursor(query?: IDBKeyRange, direction?: PromissingIDBCursorDirection): Promise<IDBCursor|null>       {
    console.warn("TODO: Research")
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.openKeyCursor( query, direction);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }

  /** Adds an item to the DB, should an item with the same key exist, then
  * it will be overwritten (Use `add` if you don't want to overwrite data on accident)
  */
  put(obj: any, key?: IDBValidKey):Promise<IDBValidKey> {
    return new Promise( (resolve, reject) => {
        const req:IDBRequest =  this._store.put( obj, key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (ev) => reject((ev?.target as IDBRequest)?.error);
    })
  }
}

export class PromissingIDBStoreConstructor {

    private _store: IDBObjectStore;
    private _pidbStore: PromissingIDBStore;

    get store() { return this._pidbStore; }

    constructor(store: IDBObjectStore) {
        this._store = store;
        this._pidbStore = new PromissingIDBStore(this._store);
    }

    createIndex(indexName: string, keyPath: string|string[], indexOptions?: IDBIndexParameters|undefined) {
        this._store.createIndex(indexName, keyPath, indexOptions);
        return this;
    }

    dropIndex(indexName: string) {
        this._store.deleteIndex(indexName);
        return this;
    }


}
export class PromissingIDBConstructor {
    private db: IDBDatabase;
    private tx: IDBTransaction|null;

    constructor(db: IDBDatabase, tx: IDBTransaction|null) { this.db = db, this.tx = tx; }

    async createStore(storeName: string, storeOptions: IDBObjectStoreParameters|undefined): Promise<PromissingIDBStoreConstructor> {
        let me = this;
        return new Promise((resolve, reject) => {
            const store: IDBObjectStore = this.db.createObjectStore(storeName, storeOptions);
            const builder = new PromissingIDBStoreConstructor(store);
            resolve(builder);
        })
    }

    async editStore(storeName: string): Promise<PromissingIDBStoreConstructor> {
        return new Promise((resolve, reject) => {
            if(!this.tx)
                reject(new PromissingIDBConstructionError("no transaction running"));
            else if(this.db.objectStoreNames.contains(storeName)) {
                const store: IDBObjectStore = this?.tx?.objectStore(storeName);
                const builder = new PromissingIDBStoreConstructor(store);
                resolve(builder);
            }
            else reject(new PromissingIDBConstructionError(`no store with name '${storeName}' found`));
        })
    }

}

export class PromissingIDBTransaction {
  private tx;
  private stores = new Map<string, PromissingIDBStore>();

  constructor(tx: IDBTransaction) {
    this.tx = tx;
  }

  commit(): void { this.tx.commit(); }
  abort(): void { this.tx.abort(); }

  objectStore(storeName: string): PromissingIDBStore {
    if(this.stores.has(storeName))
      return (this.stores.get(storeName) as PromissingIDBStore);
    else {
      if(!this.tx.objectStoreNames.contains(storeName))
        throw new PromissingIDBError(`store '${storeName}' not available in transaction`);

      const st = new PromissingIDBStore(this.tx.objectStore(storeName));
      this.stores.set(storeName, st);
      return st;
    }
  }
}

export class PromissingIDB {
    static open(
        dbName: string,
        dbVersion: number,
        onUpdate: (oldVersion: number, newVersion: number|null, db: PromissingIDBConstructor) => Promise<any>
    ): Promise<PromissingIDB> {

        return new Promise( (resolve, reject) => {

            const req:IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);
            req.onupgradeneeded = async (ev: IDBVersionChangeEvent) => {
                const targetResult: IDBDatabase = ((ev?.target as IDBRequest)?.result as IDBDatabase);
                const builder = new PromissingIDBConstructor(targetResult, req.transaction);

                try {
                    await onUpdate(ev.oldVersion, ev.newVersion, builder);
                }
                catch( anything ) {
                    console.error("Error during upgrade:", anything)
                    req.transaction?.abort();
                }
            };

            req.onsuccess = () => {
              const db = new PromissingIDB(req.result);
              resolve(db);
            };

            req.onerror = (ev) => {
                console.error(" failed to oopen db ", dbName, dbVersion, ev)
                reject((ev?.target as IDBRequest)?.error)
            }

        })
    }

    private db;

    private constructor(db: IDBDatabase) { this.db = db; };

    async tx(
      storeNames: string|string[],
      action: (tx: PromissingIDBTransaction, st?: PromissingIDBStore) => Promise<any>,
      mode: IDBTransactionMode = "readonly",
      options?:IDBTransactionOptions,
    ){
        if(storeNames.length == 0) throw new PromissingIDBError("Transactions need at least one store");
        const tx = new PromissingIDBTransaction(this.db.transaction(storeNames, mode, options));

        let storeName = "";
             if(typeof(storeNames) === 'string') storeName = storeNames;
        else if(storeNames?.length === 1       ) storeName = storeNames[0];

        const st = storeName ? tx.objectStore(storeName) : undefined;

        await action(tx, st);

    }

}


export default PromissingIDB
