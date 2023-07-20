import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { TodoData } from '../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit, DoCheck  {

  @ViewChild("todoListContainer") listContainer: any

  private _todoList: TodoData[] = [];
  @Input("todoList") set todoList(list: TodoData[]){
    console.log("todolist input changed", list);
    this._todoList = list;
    this.initRenderList();
  }

  @Input("timer")   set timer(timer: number) {
    console.log("timer changed", timer);
  }

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


    if (!this._todoList) arr = [];
    else {
      if(this.reverseSort)  arr = this._todoList.sort( sortFNC ).reverse();
      else                  arr = this._todoList.sort( sortFNC );
    }
    this.renderTodoList.splice(0, this.renderTodoList.length, ...arr);

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
    console.log("ngDoCheck");
    if(this._processedReverseSort !== this.reverseSort) {
      localStorage.setItem("angular_todos_reversesort", this.reverseSort ? "true" : "false");
      this._processedReverseSort = this.reverseSort;
      this.initRenderList()
    }
  }
}
