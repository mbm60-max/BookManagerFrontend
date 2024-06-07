import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
  private authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    isLoggedIn: false,
  };
  constructor() {}

  setAuth(authObject:AuthProps) {
    this.authStatus = authObject;
  }

  getLoggedIn(): boolean {
    return this.authStatus.isLoggedIn;
  }
  getStatus(): AuthProps{
    return this.authStatus;
  }
}