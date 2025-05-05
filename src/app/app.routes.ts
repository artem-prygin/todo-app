import { Routes } from '@angular/router';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { RoutesConstants } from './components/constants/routes.constants';

export const routes: Routes = [
  { path: RoutesConstants.ADD, component: AddTodoComponent },
  { path: RoutesConstants.LIST, component: TodoListComponent },
  { path: RoutesConstants.FAVORITE, component: TodoListComponent },
  { path: '**', redirectTo: RoutesConstants.LIST },
];
