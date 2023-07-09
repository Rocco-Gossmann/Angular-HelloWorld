import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TodoData } from '../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit, OnChanges {

  @ViewChild("todoList") listContainer: any
  @Input("todoList") todoList?: Set<TodoData>;

  renderTodoList: TodoData[] = [];

  initRenderList() {
    let arr: TodoData[];
    if (!this.todoList) arr = [];
    else {
      arr = Array.from(this.todoList.values()).sort(
        (a: TodoData, b: TodoData) => (a.done > b.done)
          ? 1
          : (b.done > a.done) ? -1 : 0
      );
    }
    this.renderTodoList.splice(0, this.renderTodoList.length, ...arr);
  }

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);
    this.initRenderList();
  }

  ngOnInit(): void { console.log("on init", this.initRenderList()) }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes);
  }
}
