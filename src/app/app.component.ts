import { Component } from '@angular/core';
import { TodoData, todoManager } from '../data/todomanager/todomanager.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  todoList: Set<TodoData> = todoManager.list;
}
