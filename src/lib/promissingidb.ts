export class PromissingIDBConstructionError extends Error {

}

export class PromissingIDBStore {
  private _store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
      this._store = store;
  }

  private _idbRequestToPromise<T>( invokeRequestFunction: (...args: any) => IDBRequest, ...args: any[] ): Promise<T> {
      return new Promise( (resolve, reject) => {
          const req:IDBRequest<IDBValidKey> =  invokeRequestFunction(...args);
          req.onsuccess = (ev) => resolve(req.result as T);
          req.onerror = (ev) => reject(ev);
      })
  }

  add(obj: Object, key?: IDBValidKey): Promise<IDBValidKey>       {
    return this._idbRequestToPromise<IDBValidKey>(this._store.add, obj, key);
  }
  clear(): Promise<undefined>         {
    return this._idbRequestToPromise<undefined>(this._store.clear);
  }
  count(query?: IDBKeyRange): Promise<number>            {
    return this._idbRequestToPromise<number>(this._store.count, query );
  }
  delete(key: IDBKeyRange): Promise<undefined>         {
    return this._idbRequestToPromise<undefined>(this._store.delete, key);
  }
  get(key: string): Promise<Object|undefined>  {
    return this._idbRequestToPromise<Object|undefined>(this._store.get, key );
  }
  getKey(indexName: any): Promise<any >       {
    console.warn("TODO: Research")
    return this._idbRequestToPromise<IDBKeyRange>(this._store.getKey, indexName);
  }
  getAll(query?: IDBKeyRange, count?: number): Promise<Object[]>       {
    console.warn("TODO: Research")
    return this._idbRequestToPromise<Object[]>(this._store.getAll, query, count );
  }
  getAllKeys(query?: IDBKeyRange, count?: number): Promise<any>       {
    console.warn("TODO: Research")
    return this._idbRequestToPromise<IDBValidKey>(this._store.getAllKeys, query, count );
  }
  openKeyCursor(query?: IDBKeyRange, direction?: "next"|"nextunique"|"prev"|"prevunique" ): Promise<IDBCursorWithValue|null>       {
    console.warn("TODO: Research")
    return this._idbRequestToPromise<IDBCursorWithValue|null>(this._store.openKeyCursor, query, direction);
  }
  put(obj: Object, key?: IDBValidKey):Promise<IDBValidKey>       {
    console.warn("TODO: Research")
    return this._idbRequestToPromise<IDBValidKey>(this._store.put, obj, key);
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

            req.onsuccess = resolve;

            req.onerror = (ev) => {
                console.error(" failed to oopen db ", dbName, dbVersion, ev)
                reject(ev)
            }

        })
    }
}


export default PromissingIDB
