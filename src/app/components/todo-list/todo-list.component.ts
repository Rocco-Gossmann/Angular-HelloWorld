import { ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import todoManager, { TodoData } from '../../../data/todomanager/todomanager.module';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit, OnDestroy {

  @ViewChild("todoListContainer") listContainer: any

  private _todoListSub?: Subscription;
  private _todoList: TodoData[] = [];

  renderTodoList$ = new BehaviorSubject < TodoData[] > ([]);

  /** true means, neasest todo will be on top */
  reverseSort: boolean = false;

  dirty = 0;

  updateReverseSort(ev: Event) {
    this.reverseSort = (ev.target as any)?.checked || false;
    localStorage.setItem('angular_todos_reversesort', this.reverseSort ? "true" : "false");
    this.initRenderList();
  }

  initRenderList() {
//    console.log("called initRenderList", this.reverseSort);
//    console.log("List to sort:");
//    console.table(this._todoList);

    let arr: TodoData[] = [...this._todoList];

    if (!this._todoList) arr = [];
    else {
      if (this.reverseSort) {
//        console.log("reverse sort")
        arr = arr.sort(
          (a: TodoData, b: TodoData) => (a.done > b.done)
            ? -1
            : (b.done > a.done) ? 1 : 0
        ).reverse();
      }
      else {
//        console.log("normal sort")
        arr = arr.sort(
          (a: TodoData, b: TodoData) => (a.done > b.done)
            ? 1
            : (b.done > a.done) ? -1 : 0
        );
      }
    }

 //   console.log("next list", arr === this._todoList);
 //   console.table(arr);
    this.renderTodoList$.next(arr);
  }

  prnt(...msg: any[]) { console.log.apply(null, msg) }

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);
    this.initRenderList();
  }

  ngOnInit(): void {

    this.reverseSort = localStorage.getItem("angular_todos_reversesort") === "true";

    this._todoListSub = todoManager.list$.subscribe((list: Set<TodoData>) => {
      this._todoList = Array.from(list.values());
      this.initRenderList();
    });

    window.setTimeout( () => this.initRenderList(), 30 )
  }

  ngOnDestroy() {
    this._todoListSub?.unsubscribe()
  }
}
