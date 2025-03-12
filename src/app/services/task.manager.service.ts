import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { Task } from '../models/task.model';

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

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks').pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>('/api/tasks', task).pipe(
      catchError(this.handleError)
    );
  }

  editTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
