import { BehaviorSubject, delay, map } from 'rxjs';
import { TodoInterface } from '../interfaces/todo.interface';
import { inject, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly STORAGE_KEY = 'todo-list';
  private todos$ = new BehaviorSubject<TodoInterface[]>([]);
  private localStorage: StorageMap = inject(StorageMap);

  get todos(): TodoInterface[] {
    return this.todos$.value;
  }

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.localStorage.get(this.STORAGE_KEY).subscribe((todos) => {
      this.todos$.next(todos as TodoInterface[] || []);
    });
  }

  addTodo(): void {
    this.localStorage.set(this.STORAGE_KEY, { 'updated': 123 }).pipe(
      delay(300),
    ).subscribe(() => {
      console.log(99999);
      this.todos$.next([{ id: '1', title: '1' }]);
      console.log(this.todos$.value);
    });
  }
}
