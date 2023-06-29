import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [ CommonModule ]
})


export class TodoData {
  description: string   = "";
  done       : boolean  = false;
  tags       : string[] = [];
}


export class TodomanagerModule {

  list: Set<TodoData> = new Set();

  constructor() {

    this.list.add({
      description: "todo 1",
      done: false,
      tags: []
    });

    this.list.add({
      description: "todo 2",
      done: true,
      tags: []
    });

    this.list.add({
      description: "todo 3",
      done: false,
      tags: []
    });

  }

}

export const todoManager = new TodomanagerModule();
export default todoManager;
