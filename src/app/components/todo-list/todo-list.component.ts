import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TodoData, todoManager } from '../../../data/todomanager/todomanager.module';
import { transition } from '@angular/animations';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent implements OnInit, AfterViewChecked, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild("todoList") listContainer: any

  viewtransitionFinished: (value?: unknown) => void = () => { console.log("finished stuff") };  

  todoList: Set<TodoData> = todoManager.list;
  renderTodoList: TodoData[] =  [];

  divObserver: MutationObserver = new MutationObserver((mutations) => {
      console.log("observed mutation", mutations);
      this.viewtransitionFinished();
  });


  initRenderList() {
    const arr = Array.from(this.todoList.values()).sort( 
      (a:TodoData, b:TodoData) => (a.done > b.done) 
        ? 1 
        : (b.done > a.done) ? -1 : 0
    );

    this.renderTodoList = arr;
  }

  onTodoDone(...args: any[]) {
    console.log("todo has been set done", args);

    const doc = (document as any);
    if(doc.startViewTransition) {
      const transition = doc.startViewTransition(
        async () => {
          const me: any = this;
          window.setTimeout(()=>this.initRenderList(), 500);
          return await new Promise((res, rej) => {
            console.log("setup promise", this)
            this.viewtransitionFinished = res
          })
        }
      )

      transition.updateCallbackDone.then( (...args: any[]) => console.log("update callback done", ...args));
      console.log(transition);
    } 
    else {
      console.warn("Browser does not support viewTransitions");
      this.initRenderList(); 
    }
  }

  ngOnInit()                         : void { console.log("on init"           , this.initRenderList()) }
  ngAfterViewInit()                  : void { console.log("after view init"   , this.listContainer.nativeElement); }
  ngAfterViewChecked()               : void { console.log("after view checked", this.viewtransitionFinished()); }
  ngOnChanges(changes: SimpleChanges): void { console.log("on change"         , changes); }
  ngOnDestroy()                      : void { console.log("on change"         ); }
}

console.log(todoManager.list);
