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
  offsetY = 0;
  animStart = 0;

  comeInAnimation = () => {
    this.container.nativeElement.removeEventListener("animationend", this.comeInAnimation);
    this.animclass = ""
    this.offsetY = this.animStart = 0;
  }

  toggleDone() {

    if(this.todo) {
      this.todo.done = !this.todo.done
      this.offsetY = this.container.nativeElement.offsetTop;
      this.animclass = "animout"
      this.onDone.emit(this?.todo?.done);

      window.setTimeout(() => {
        this.animStart = this.offsetY - this.container.nativeElement.offsetTop;
        this.container.nativeElement.addEventListener("animationend", this.comeInAnimation);
        this.animclass="animin"
      }, 15);

    }
  }

}
