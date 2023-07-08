import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { TodoData } from '../../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list-entry',
  templateUrl: './todo-list-entry.component.html',
  styleUrls: ['./todo-list-entry.component.css']
})
export class TodoListEntryComponent {

  @Input() todo?: TodoData
  @Output() onDone: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("maincontainer") container!: ElementRef<HTMLElement>;

  animclass = "";

  comeInAnimation = () => {
    console.log("come in end");
    this.container.nativeElement.removeEventListener("animationend", this.comeInAnimation);
    this.animclass = ""
  }
  goOutAnimation = () => {
    console.log("go out end");
    this.container.nativeElement.removeEventListener("animationend", this.goOutAnimation);
    this.container.nativeElement.addEventListener("animationend", this.comeInAnimation);
    this.animclass = "animin"
    this.onDone.emit(this.todo?.done);
  }

  toggleDone() {
    if(this.todo) {
      this.todo.done = !this.todo.done
    }

    this.container.nativeElement.addEventListener("animationend", this.goOutAnimation);
    this.animclass = "animout"
  }

}
