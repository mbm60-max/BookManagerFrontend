import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule,MatIconModule,MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!:FormGroup;
  constructor(private formBuilder:FormBuilder,private router:Router,private authService:AuthService){
    this.loginForm=this.formBuilder.group({
      email:formBuilder.control('',[Validators.required,Validators.email, Validators.minLength(5)]),
      password:formBuilder.control('',[Validators.required, Validators.minLength(7)]),
  })}
  public onSubmit(){
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.signin(email, password).subscribe(
        (res: any) => {
          if (res.id && res.isAuthenticated) {
            const name = "None";
            const id = res.id;
            console.log("Authenticated");
            this.authService.setAuth({
            name, id, email, isLoggedIn: true
            });
            this.router.navigate(['/home']);
          } else {
            console.error('Authentication failed', res);
            // Handle authentication failure
          }
        },
        (err: any) => {
          console.error('Signin failed', err);
          // Handle error
        }
      );
    }
  } 
  onRegister(){
    this.router.navigate(['/register']);
  }
}