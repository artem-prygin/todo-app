import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgClass,
  ],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  public data: { message: string } = inject(MAT_DIALOG_DATA);
  public dialogRef: MatDialogRef<ConfirmationDialogComponent> = inject(MatDialogRef);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
