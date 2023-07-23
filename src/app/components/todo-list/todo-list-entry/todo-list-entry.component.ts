import {
  AfterContentChecked,
  AfterViewChecked, Component
  , ElementRef
  , EventEmitter
  , Input
  , Output
  , ViewChild
} from '@angular/core'

import { TodoData } from '../../../../data/todomanager/todomanager.module';

@Component({
  selector: 'app-todo-list-entry',
  templateUrl: './todo-list-entry.component.html',
  styleUrls: ['./todo-list-entry.component.css'],
})
export class TodoListEntryComponent implements AfterViewChecked, AfterContentChecked {
  @Input() todo?: TodoData
  @Output() onDone: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("maincontainer") container!: ElementRef<HTMLElement>;

  animclass = "";
  offsetY = 0;
  animStart = 0;
  animOffsetY = 0;

  comeInAnimation = () => {

    this.container.nativeElement.removeEventListener("animationend", this.comeInAnimation);

    console.log("animation end", this.todo?.description)
    this.animclass = ""
    this.animStart = 0;
  }

  toggleDone() {

    if (this.todo) {
      this.todo.done = !this.todo.done
      this.onDone.emit(this?.todo?.done);

      this.animOffsetY = this.offsetY;
      console.log("toggleDone", this.todo.description, this.offsetY, this.animOffsetY);
    }
  }

  ngAfterContentChecked(): void {
    if (this.animOffsetY > 0) {
      this.animclass = "animout"
    }
    console.log("after content checked", this.todo?.description, this.offsetY, this.animOffsetY, this.animStart)
  }

  rndr(...msg: unknown[]) { console.log.apply(null, msg); }

  ngAfterViewChecked(): void {

    this.offsetY = this.container.nativeElement.offsetTop;

    if (this.animOffsetY > 0) {

      // calculate the actuall animations start
      this.animStart = this.animOffsetY - this.offsetY;

      // \/===== Important otherwise this turns into an endless loop
      this.animOffsetY = 0;

      this.container.nativeElement.addEventListener("animationend", this.comeInAnimation);

      window.setTimeout(() => {
        this.animclass = "animin"
      }, 33);

      console.log("update animstart", this.todo?.description, this.animStart);

    } else if (this.animStart > 0) {
      console.log("play animation", this.todo?.description);
    }

    console.log("after view checked", this.todo?.description, this.offsetY)
  }

}
