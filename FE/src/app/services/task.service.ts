import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { API_URL } from '../constants/constants';
import { handleError } from './utils/errorHandler';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_URL}/tasks`).pipe(
        catchError(handleError)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${API_URL}/tasks/${id}`).pipe(
        catchError(handleError)
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${API_URL}/tasks`, task).pipe(
        catchError(handleError)
    );
  }

  editTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/tasks/${id}`, task).pipe(
        catchError(handleError)
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tasks/${id}`).pipe(
        catchError(handleError)
    );
  }

  getTaskTypes(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${API_URL}/task-types`).pipe(
      catchError(handleError)
    );
  }

  getTaskStatuses(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${API_URL}/task-statuses`).pipe(
      catchError(handleError)
    );
  }

  addNewType(newType: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/task-types`, { name: newType }).pipe(
      catchError(handleError)
    );
  }

  addNewStatus(newStatus: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/task-statuses`, { name: newStatus }).pipe(
      catchError(handleError)
    );
  }
}
