import { HttpErrorResponse } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { ServerError } from '../models/server-error';
import { FormGroup } from '@angular/forms';

export function handleFormErrors(
  form: FormGroup,
  error: HttpErrorResponse,
  errorMessages: WritableSignal<ServerError>,
): void {
  form.setErrors({ invalid: true });
  if (error.error) {
    errorMessages.set(error.error as ServerError);

    Object.keys(errorMessages()).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.setErrors({ serverError: errorMessages()[key] });
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  } else {
    errorMessages.set({ detail: 'Ha ocurrido un error inesperado' });
  }
}
