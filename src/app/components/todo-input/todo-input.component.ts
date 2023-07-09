import { Component, OnChanges, SimpleChanges } from '@angular/core';
import todoManager from 'projects/todos/src/data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.css']
})
export class TodoInputComponent implements OnChanges {

  textInput: string = "";

  ngOnChanges(changes: SimpleChanges): void {
      throw new Error('Method not implemented.');
  }

  onInputSubmit() {
    if(!this.textInput.trim()) return;

    todoManager.list.add({
        description: this.textInput,
        done: false,
        tags: []
    });
    todoManager.list = todoManager.list;

    this.textInput = "";
  }

}
