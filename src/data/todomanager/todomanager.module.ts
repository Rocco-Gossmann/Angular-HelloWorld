import { EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import key from '../key/key.module';

import { db, store_todos } from '../db';

@NgModule({
  declarations: [],
  imports: [ CommonModule ]
})


export class TodoData {
  description: string   = "";
  done       : boolean  = false;
  tags       : string[] = [];
}

export interface TodoDataSet {
  id: number;
  data: string;
  iv: string;
}

export class TodomanagerModule extends EventEmitter<Set<TodoData>> {

  list: Set<TodoData> = new Set();

  constructor() {
    super(true);
    console.log("todo-manager->key", key.cryptoKey);
    db.then( db => {
      db.tx(store_todos, async (tx, st) => {

        let cur = await st?.openCursor<TodoData>();

        while(cur) {
          this.list.add(cur?.value);
          cur = await cur.continue();
        }

        this.emit(this.list);

      })
    })
  }

  async addTodo(todo: TodoData) {
    (await db).tx(store_todos, (tx, st) => (st?.add(todo) as Promise<any>), "readwrite");
    this.list.add(todo);
    this.emit(this.list);
  }

}

export const todoManager = new TodomanagerModule();
export default todoManager;

