import { Component, Input } from '@angular/core';
import { TodoData } from 'projects/todos/src/data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list-entry',
  templateUrl: './todo-list-entry.component.html',
  styleUrls: ['./todo-list-entry.component.css']
})
export class TodoListEntryComponent {

  @Input() todo?: TodoData

  toggleDone() {
    if(this.todo)
      this.todo.done = !this.todo.done
  }


}
