import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface AuthProps{
  email:string;
  name:string;
  id:string;
  isLoggedIn:boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl + '/auth';
  private authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    isLoggedIn: false,
  };
  setAuth(authObject:AuthProps) {
    this.authStatus = authObject;
  }

  getLoggedIn(): boolean {
    return this.authStatus.isLoggedIn;
  }
  getStatus(): AuthProps{
    return this.authStatus;
  }
  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/signup`;
    const body = { email, password };
    return this.http.post<any>(url, body);
  }
  signin(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/signin`;
    const body = { email, password };
    return this.http.post<any>(url, body);
  }
  updateUser(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/updateUser`;
    const body = { email, password };
    return this.http.post<any>(url, body);
  }
  deleteUser(id:string,email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    const body = { email, password };
    return this.http.delete<any>(url);
  }
}
