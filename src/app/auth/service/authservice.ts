import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login.interface';

const apiUrl = 'http://localhost:8080/api/auth/login';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private _http = inject(HttpClient);

  login(username: string, email: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(apiUrl, { username, email });
  }


}
