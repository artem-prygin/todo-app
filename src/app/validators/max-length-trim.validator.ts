import { AbstractControl, ValidationErrors } from '@angular/forms';

export const MaxLengthTrimValidator = (maxLength: number) => (control: AbstractControl): ValidationErrors | null => {
  const trimmedValue = control.value.trim();

  if (trimmedValue.length === 0) {
    return { required: true };
  }

  return trimmedValue.length > maxLength ? { trimmedMaxLength: true } : null;
};
