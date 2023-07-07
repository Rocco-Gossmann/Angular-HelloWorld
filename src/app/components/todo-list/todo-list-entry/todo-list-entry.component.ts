import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoData } from '../../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list-entry',
  templateUrl: './todo-list-entry.component.html',
  styleUrls: ['./todo-list-entry.component.css']
})

export class TodoListEntryComponent {

  @Input() todo?: TodoData;
  @Output() onDone: EventEmitter<boolean> = new EventEmitter();

  toggleDone() {
    if(this.todo)
      this.todo.done = !this.todo.done

    this.onDone.emit(this.todo?.done);
  }
}
