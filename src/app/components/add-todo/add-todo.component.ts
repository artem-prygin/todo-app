import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatSuffix } from '@angular/material/input';
import { v4 } from 'uuid';

import { TodoService } from '../../services/todo.service';
import { TodoInterface } from '../../interfaces/todo.interface';
import { RoutesConstants } from '../constants/routes.constants';
import { MaxLengthTrimValidator } from '../../validators/max-length-trim.validator';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    MatIcon,
    MatInput,
    MatSuffix,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent implements OnInit {
  private todoService: TodoService = inject(TodoService);
  private router: Router = inject(Router);
  private location = inject(Location);

  form = new FormGroup({
    title: new FormControl<string>('', [MaxLengthTrimValidator(100)]),
    expirationDate: new FormControl<Date | null>(null, [Validators.required]),
    expirationTime: new FormControl<string | null>(null),
  });
  isSubmittedWithError: boolean = false;
  isPastTime: boolean;

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.validateTime();
    });
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }

  filterDates(pickerDate: Date): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return pickerDate >= currentDate;
  };

  validateTime(): void {
    if (!this.form.value.expirationDate) return;

    const currentTime = Date.now();
    const inputTimeInMs = this.convertDateTimeToMilliseconds(
      this.form.value.expirationDate,
      this.form.value.expirationTime,
    );

    this.isPastTime = currentTime >= inputTimeInMs;
  }

  convertDateTimeToMilliseconds(date: Date, time: string): number {
    if (!time) {
      date.setHours(23, 59, 59, 59);
      return date.getTime();
    }

    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  }

  addTodoItem(): void {
    this.validateTime();

    if (this.form.invalid || this.isPastTime) {
      this.form.markAllAsTouched();
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
      });

      this.isSubmittedWithError = true;
      return;
    }

    const expiredAt: number = this.convertDateTimeToMilliseconds(this.form.value.expirationDate, this.form.value.expirationTime);

    const newTodo: TodoInterface = {
      id: v4(),
      title: this.form.value.title.trim(),
      createdAt: Date.now(),
      expiredAt,
    };
    this.todoService.addTodo(newTodo);
    this.router.navigate([RoutesConstants.LIST]);
  }
}
