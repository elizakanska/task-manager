import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { API_URL } from '../constants/constants';
import { handleError } from './utils/errorHandler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers(searchQuery: string = ''): Observable<User[]> {
    const params = searchQuery ? { params: { searchQuery } } : {};
    return this.http.get<User[]>(`${API_URL}/users`, params).pipe(
      catchError(handleError)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/${id}`).pipe(
      catchError(handleError)
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${API_URL}/users`, user).pipe(
      catchError(handleError)
    );
  }

  editUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_URL}/users/${id}`, user).pipe(
      catchError(handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/users/${id}`).pipe(
      catchError(handleError)
    );
  }
}
