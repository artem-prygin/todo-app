import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { RoutesConstants } from '../constants/routes.constants';
import { TodoTypesEnum } from '../../enums/todo-types.enum';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoInterface } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoItemComponent,
    RouterLink,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, OnDestroy {
  private todoService: TodoService = inject(TodoService);
  private router: Router = inject(Router);

  sub$ = new Subscription();
  removingIDsInProgress$: BehaviorSubject<string[]> = this.todoService.removingIDsInProgress$;

  isFavouritePage: boolean;
  todayTodos: TodoInterface[] = [];
  otherTodos: TodoInterface[] = [];
  favouriteTodos: TodoInterface[] = [];

  readonly RoutesConstants: typeof RoutesConstants = RoutesConstants;
  TodoTypesEnum = TodoTypesEnum;

  constructor() {
    this.isFavouritePage = this.router.url.includes(RoutesConstants.FAVOURITE);
  }

  ngOnInit(): void {
    this.sub$.add(
      this.todoService.todos$.subscribe(todos => {
        const sortedTodos = todos.sort((a, b) => a.expiredAt - b.expiredAt);
        this.todayTodos = sortedTodos.filter(todo => this.isToday(todo.expiredAt));
        this.otherTodos = sortedTodos.filter(todo => !this.isToday(todo.expiredAt));
        this.favouriteTodos = sortedTodos.filter(todo => todo.isFavourite);
      }),
    );
  }

  isToday(ms: number): boolean {
    const inputDate: Date = new Date(ms);
    const today: Date = new Date();

    return inputDate.getFullYear() === today.getFullYear()
      && inputDate.getMonth() === today.getMonth()
      && inputDate.getDate() === today.getDate();
  }

  removeTodo(id: string): void {
    this.todoService.removeTodo(id);
  }

  toggleFavouriteTodo(id: string): void {
    this.todoService.toggleFavouriteTodo(id);
  }

  trackByTodoID(index: number, todo: TodoInterface): string {
    return todo.id;
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
