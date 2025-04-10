import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  console.error('An error occurred:', error);
  if (error.error instanceof ErrorEvent) {
    console.error('Error message:', error.error.message);
  } else {
    console.error(`Server returned code: ${error.status}, body was: ${error.error}`);
  }
  return throwError(() => new Error('Something went wrong; please try again later.'));
}
