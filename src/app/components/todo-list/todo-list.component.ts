import { Component } from '@angular/core';
import { TodoData, todoManager } from '../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent {

  todoList: Set<TodoData> = todoManager.list;

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);
  }

}


console.log(todoManager.list);
