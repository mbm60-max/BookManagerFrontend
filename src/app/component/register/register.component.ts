import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
registerForm!:FormGroup;
constructor(private formBuilder:FormBuilder,private router:Router, private authService: AuthService,){
  this.registerForm=this.formBuilder.group({
    email:formBuilder.control('',[Validators.required,Validators.email, Validators.minLength(5)]),
    password:formBuilder.control('',[Validators.required, Validators.minLength(7)]),
})}
public onSubmit(){
  if (this.registerForm.valid) {
    const { email, password } = this.registerForm.value;
    this.authService.signup(email, password).subscribe(
      (res: any) => {
        console.log('Registration successful', res);
        // Handle successful registration, e.g., navigate to login or home
        this.router.navigate(['/home']);
      },
      (err: any) => {
        console.error('Registration failed', err);
        // Handle error
      }
    );
  }
}
onLogin(){
  this.router.navigate(['/login']);
}
}