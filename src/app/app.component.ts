import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoData, todoManager } from '../data/todomanager/todomanager.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  todoList: TodoData[] = [];
  timer: number = Date.now();

  private todoListSubscription?: Subscription;

  updateList(newList: Set<TodoData>) {
      console.log("reassign list", newList, this.todoList);
      this.todoList = Array.from(newList.values());
      window.setTimeout( () =>{
        console.log("bla");
        this.timer = Date.now() + Math.random();
      }, 500);
  }

  ngOnInit() {
    this.todoListSubscription = todoManager.subscribe( this.updateList );
  }

  ngOnDestroy() {
    this.todoListSubscription?.unsubscribe();
  }
}
