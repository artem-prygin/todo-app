import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent implements OnInit {
  private todoService: TodoService = inject(TodoService);

  public form = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    expirationDate: new FormControl<Date | null>(null, [Validators.required]),
    expirationTime: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(val => {
    });
  }

  addTodoItem(): void {
    console.log(this.todoService.todos);
    this.todoService.addTodo();
    this.form.reset();
  }
}
