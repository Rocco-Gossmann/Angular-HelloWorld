import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListEntryComponent } from './todo-list-entry.component';

describe('TodoListEntryComponent', () => {
  let component: TodoListEntryComponent;
  let fixture: ComponentFixture<TodoListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListEntryComponent]
    });
    fixture = TestBed.createComponent(TodoListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
