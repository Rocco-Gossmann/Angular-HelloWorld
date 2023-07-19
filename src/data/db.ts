import PromissingIDB, { PromissingIDBConstructor, PromissingIDBStoreConstructor } from "../lib/promissingidb";

export const store_todos = "todos";
export const store_tags = "tags";

export const db = PromissingIDB.open("angular_todos", 4, async (ov: number, nv: number | null, db: PromissingIDBConstructor) => {

  let todoStore: PromissingIDBStoreConstructor | undefined;
  let tagsStore: PromissingIDBStoreConstructor | undefined;

  switch (ov) {
    //@ts-ignore
    case 0:
      todoStore = (await db.createStore(store_todos, { autoIncrement: true }))
        .createIndex("tags", "tags", { multiEntry: true })
        .createIndex("dummy", "dummy", { unique: true })

    //@ts-ignore
    case 1:
      todoStore = (todoStore || await db.editStore(store_todos))
        .dropIndex("dummy")

    //@ts-ignore
    case 2:
      tagsStore = (await db.createStore(store_tags, { keyPath: "id" }))

      await tagsStore.store.add({
        "id": Date.now(),
        "value": "Hello world"
      });

    //@ts-ignore
    case 3:
      tagsStore = (tagsStore || await db.editStore(store_tags));
      await tagsStore.store.clear();

  }
})

db.catch(err => {
  console.error("DB create error", err)
  const errmsg = "error while loading the database, interferance detected.\n\nClick 'cancel' to close the window and try again\nClick 'ok' to clear to reset the database (you will loose all Data)";
  if (confirm(errmsg)) {

    indexedDB.deleteDatabase('angular_todos');
    window.location.href=window.location.href;

  }
  else {
    alert("closing window");
    window.location.href="about:blank";
    window.close();
  };
})
