import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListResponse, User } from '../models/user-list.interface';

const apiUrl = 'http://localhost:8080/api/users';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);

  getUsers(): Observable<UserListResponse> {
    return this._http.get<UserListResponse>(apiUrl);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<ApiResponse<User>> {
    return this._http.put<ApiResponse<User>>(`${apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this._http.delete<ApiResponse<void>>(`${apiUrl}/${id}`);
  }
}
