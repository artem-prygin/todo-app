import { BehaviorSubject, delay } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

import { TodoInterface } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos$ = new BehaviorSubject<TodoInterface[]>([]);
  removingIDsInProgress$ = new BehaviorSubject<string[]>([]);

  private readonly STORAGE_KEY = 'todos';
  private localStorage: StorageMap = inject(StorageMap);

  get todos(): TodoInterface[] {
    return this.todos$.value;
  }

  constructor() {
    this.loadTodos();
  }

  addTodo(newTodo: TodoInterface): void {
    this.localStorage.set(this.STORAGE_KEY, [...this.todos$.value, newTodo])
      .subscribe(() => {
        this.todos$.next([...this.todos$.value, newTodo]);
      });
  }

  removeTodo(id: string): void {
    this.removingIDsInProgress$.next([...this.removingIDsInProgress$.value, id]);
    const filteredTodos: TodoInterface[] = this.todos$.value.filter(todo => todo.id !== id);

    this.localStorage.set(this.STORAGE_KEY, filteredTodos).pipe(
      delay(500),
    ).subscribe(() => {
      this.todos$.next(filteredTodos);
      this.removingIDsInProgress$.next(this.removingIDsInProgress$.value.filter(favID => favID !== id));
    });
  }

  toggleFavouriteTodo(id: string): void {
    const todos: TodoInterface[] = [...this.todos$.value];
    const todoToUpdateIndex = todos.findIndex(todo => todo.id === id);

    if (todoToUpdateIndex !== -1) {
      todos[todoToUpdateIndex] = {
        ...todos[todoToUpdateIndex],
        isFavourite: !todos[todoToUpdateIndex].isFavourite,
      };
    }

    this.localStorage.set(this.STORAGE_KEY, todos)
      .subscribe(() => {
        this.todos$.next(todos);
      });
  }

  private loadTodos(): void {
    this.localStorage.get(this.STORAGE_KEY)
      .subscribe((todos) => {
        this.todos$.next(todos as TodoInterface[] || []);
      });
  }
}
