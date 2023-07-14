import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { TodoData } from '../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit, DoCheck {

  @ViewChild("todoListContainer") listContainer: any
  @Input("todoList")              todoList?: Set<TodoData>;

  private _processedTodoListSize: number = 0;

  /** true means, neasest todo will be on top */
  reverseSort: boolean = false;
  private _processedReverseSort: boolean|null = null;

  renderTodoList: TodoData[] = [];

  initRenderList() {
    let arr: TodoData[];

    const sortFNC = this.reverseSort
      ? (a: TodoData, b: TodoData) => (a.done > b.done)
          ? -1
          : (b.done > a.done) ? 1 : 0

      : (a: TodoData, b: TodoData) => (a.done > b.done)
          ? 1
          : (b.done > a.done) ? -1 : 0


    if (!this.todoList) arr = [];
    else {
      if(this.reverseSort)  arr = Array.from(this.todoList.values()).sort( sortFNC ).reverse();
      else                  arr = Array.from(this.todoList.values()).sort( sortFNC );
    }
    this.renderTodoList.splice(0, this.renderTodoList.length, ...arr);

    this._processedTodoListSize = this?.todoList?.size || 0;
  }

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);
    this.initRenderList();
  }

  ngOnInit(): void {
    this.reverseSort = localStorage.getItem("angular_todos_reversesort") === "true" ;
    this._processedReverseSort = this.reverseSort;
    console.log("on init", this.initRenderList())
  }


  ngDoCheck(): void {
    let rendered = false;
    if(this._processedReverseSort !== this.reverseSort) {
      localStorage.setItem("angular_todos_reversesort", this.reverseSort ? "true" : "false");
      this._processedReverseSort = this.reverseSort;
      this.initRenderList()
      rendered = true;
    }

    if(!rendered && this._processedTodoListSize != this?.todoList?.size) {
      this.initRenderList()
    }
  }
}
