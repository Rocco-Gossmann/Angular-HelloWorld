import { Component, EventEmitter, Input, Output } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';

import { TodoData } from '../../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list-entry',
  templateUrl: './todo-list-entry.component.html',
  styleUrls: ['./todo-list-entry.component.css'],
  animations: [
    trigger("listElement", [
      state("done", style({
        backgroundColor: "lightgreen"
      })),
      state("undone", style({
        backgroundColor: "coral"
      })),

      transition("done => undone", animate(".5s")),
      transition("undone => done", animate(".5s"))
    ])
  ]
})
export class TodoListEntryComponent {

  @Input() todo?: TodoData
  @Output() onDone: EventEmitter<boolean> = new EventEmitter();

  toggleDone() {
    if(this.todo)
      this.todo.done = !this.todo.done

    this.onDone.emit(this.todo?.done);
  }

}
