import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Task } from '../models/task.model';
import { API_URL } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

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
    return this.http.get<Task[]>(`${API_URL}/tasks`).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${API_URL}/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${API_URL}/tasks`, task).pipe(
      catchError(this.handleError)
    );
  }

  editTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/tasks/${id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTaskTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/task-types`).pipe(
      catchError(this.handleError)
    );
  }

  getTaskStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/task-statuses`).pipe(
      catchError(this.handleError)
    );
  }
}
