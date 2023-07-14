import PromissingIDB, { PromissingIDBConstructor, PromissingIDBStoreConstructor } from "../lib/promissingidb";

export const db = PromissingIDB.open("angular_todos", 3, async (ov: number, nv: number|null, db: PromissingIDBConstructor) => {

    let todoStore: PromissingIDBStoreConstructor | undefined;
    let tagsStore: PromissingIDBStoreConstructor | undefined;

    switch(ov) {
        case 0:
            todoStore = (await db.createStore("todos", { autoIncrement: true }))
                .createIndex("tags", "tags", {multiEntry: true})
                .createIndex("dummy", "dummy", {unique: true})

        case 1:
            todoStore = (todoStore || await db.editStore("todos"))
                .dropIndex("dummy")

        case 2:
            tagsStore = (await db.createStore("tags", { keyPath: "id" }))

            await tagsStore.store.add({
                "id": Date.now(),
                "value": "Hello world"
            });
                

    }
    console.log("db.ts => db.open", ov, nv, db);
})