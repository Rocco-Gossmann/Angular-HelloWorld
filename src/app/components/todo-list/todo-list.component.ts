import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoData, todoManager } from '../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {

  @ViewChild("todoList") listContainer: any

  todoList: Set<TodoData> = todoManager.list;
  renderTodoList: TodoData[] =  [];

  initRenderList() {
    const arr = Array.from(this.todoList.values()).sort( 
      (a:TodoData, b:TodoData) => (a.done > b.done) 
        ? 1 
        : (b.done > a.done) ? -1 : 0
    );

    this.renderTodoList = arr;
  }

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);
    this.initRenderList(); 
  }

  ngOnInit()                         : void { console.log("on init"           , this.initRenderList()) }
}