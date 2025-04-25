import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Status } from '../models/status.model';
import { Type } from '../models/type.model';
import { API_URL } from '../constants/constants';
import { handleError } from './utils/errorHandler';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  getTasks(searchQuery: string = ''): Observable<Task[]> {
    const params = searchQuery ? { params: { searchQuery } } : {};
    return this.http.get<Task[]>(`${API_URL}/tasks`, params).pipe(
      catchError(handleError)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${API_URL}/tasks/${id}`).pipe(
      catchError(handleError)
    );
  }

  addTask(task: Task): Observable<Task[]> {
    return this.http.post<Task[]>(`${API_URL}/tasks`, task).pipe(
      catchError(handleError)
    );
  }

  editTask(id: number, task: Task): Observable<Task[]> {
    return this.http.put<Task[]>(`${API_URL}/tasks/${id}`, task).pipe(
      catchError(handleError)
    );
  }

  deleteTask(id: number): Observable<Task[]> {
    return this.http.delete<Task[]>(`${API_URL}/tasks/${id}`).pipe(
      catchError(handleError)
    );
  }

  getTaskTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(`${API_URL}/task-types`).pipe(
      catchError(handleError)
    );
  }

  getTaskStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${API_URL}/task-statuses`).pipe(
      catchError(handleError)
    );
  }

  addNewType(newType: string): Observable<Type[]> {
    return this.http.post<Type[]>(`${API_URL}/task-types`, { name: newType }).pipe(
      catchError(handleError)
    );
  }

  addNewStatus(newStatus: string): Observable<Status[]> {
    return this.http.post<Status[]>(`${API_URL}/task-statuses`, { name: newStatus }).pipe(
      catchError(handleError)
    );
  }
}
