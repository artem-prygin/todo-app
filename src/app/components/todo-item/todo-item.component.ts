import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, lastValueFrom, Subject } from 'rxjs';

import { TodoInterface } from '../../interfaces/todo.interface';
import { TodoTypesEnum } from '../../enums/todo-types.enum';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatProgressSpinner,
    MatIcon,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements OnInit, OnDestroy {
  @Input() todo: TodoInterface;
  @Input() todoType: TodoTypesEnum;
  @Input() removingIDsInProgress: string[] = [];
  @Output() removeTodo = new EventEmitter<string>();
  @Output() toggleFavouriteTodo = new EventEmitter<string>();

  private zone: NgZone = inject(NgZone);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialog: MatDialog = inject(MatDialog);

  timeLeft: string;
  private timerID: ReturnType<typeof setInterval>;
  private favouriteToggle$ = new Subject<void>();

  MAX_COUNTDOWN_SYMBOLS = 11;
  TodoTypesEnum = TodoTypesEnum;

  ngOnInit(): void {
    this.startCountdown();

    this.favouriteToggle$
      .pipe(debounceTime(300))
      .subscribe(() => this.toggleFavouriteTodo.emit(this.todo.id));
  }

  startCountdown() {
    this.zone.runOutsideAngular(() => {
      this.timerID = setInterval(() => {
        const msLeft = this.todo.expiredAt - Date.now();

        if (msLeft <= 0) {
          clearInterval(this.timerID);
          this.timeLeft = '00h 00m 00s';
          this.zone.run(() => this.cdr.markForCheck());
          this.removeTodo.emit(this.todo.id);
        } else {
          this.timeLeft = this.formatMilliseconds(msLeft);
          this.zone.run(() => this.cdr.markForCheck());
        }
      }, 1000);
    });
  }

  formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    const parts = [];
    if (hours) parts.push(`${pad(hours)}h`);
    if (minutes || hours) parts.push(`${pad(minutes)}m`);
    parts.push(`${pad(seconds)}s`);

    return parts.join(' ');
  }

  ngOnDestroy(): void {
    this.favouriteToggle$.unsubscribe();
    clearInterval(this.timerID);
  }

  async confirmRemovingTodo(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this todo?' },
      width: '300px',
    });

    const result = await lastValueFrom(dialogRef.afterClosed());
    if (result) this.removeTodo.emit(id);
  }

  emitToggleFavouriteTodo(): void {
    this.favouriteToggle$.next();
  }
}
