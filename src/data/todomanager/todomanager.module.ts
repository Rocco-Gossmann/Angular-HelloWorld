import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import key from '../key/key.module';

import { db, store_todos } from '../db';
import { BehaviorSubject } from 'rxjs';

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

export class TodomanagerModule {

  private _list: Set<TodoData> = new Set();
  list$: BehaviorSubject<Set<TodoData>> = new BehaviorSubject(this._list);

  updateStream() { this.list$.next(this._list); }

  constructor() {
    console.log("todo-manager->key", key.cryptoKey);
    db.then( db => {
      db.tx(store_todos, async (tx, st) => {

        let cur = await st?.openCursor<TodoData>();

        while(cur) {
          this._list.add(cur?.value);
          cur = await cur.continue();
        }

        this.updateStream();

      })
    })
  }

  async addTodo(todo: TodoData) {
    (await db).tx(store_todos, (tx, st) => (st?.add(todo) as Promise<any>), "readwrite");
    this._list.add(todo);
    this.updateStream();
  }

}

export const todoManager = new TodomanagerModule();
export default todoManager;

