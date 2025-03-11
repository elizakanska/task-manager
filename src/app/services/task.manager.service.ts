import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Error message:', error.error.message);
    } else {
      console.error(`Server returned code: ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something went wrong; please try again later.');
  }

  getTasks() {
    return this.http.get('/api/tasks').pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string) {
    return this.http.get(`/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTask(task: any) {
    return this.http.post('/api/tasks', task).pipe(
      catchError(this.handleError)
    );
  }

  editTask(id: string, task: any) {
    return this.http.put(`/api/tasks/${id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: string) {
    return this.http.delete(`/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  changeStatus(id: string, status: string){
    return this.http.patch(`api/tasks/${id}/status`, status).pipe(
      catchError(this.handleError)
    )
  }
}
