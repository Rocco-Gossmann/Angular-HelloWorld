import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import key from '../key/key.module';

import { db } from '../db';

@NgModule({
  declarations: [],
  imports: [ CommonModule ]
})


export class TodoData {
  description: string   = "";
  done       : boolean  = false;
  tags       : string[] = [];
}

interface TodoDataSet {
  id: number;
  data: string;
  iv: string;
}

export class TodomanagerModule {

  list: Set<TodoData> = new Set();

  constructor() { 
    console.log("todo-manager->key", key.cryptoKey);
    db.then( db => {
      console.log("TodoManager db", db);
    })
  }

  async addTodo(todo: TodoData) {
    this.list.add(todo);
  }

}

export const todoManager = new TodomanagerModule();
export default todoManager;
