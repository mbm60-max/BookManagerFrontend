import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
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
    //make call to http request to sigin and use response here
    (this.loginForm.value.email,this.loginForm.value.password).then((res: any)=>{
      if(res.data.user!.role == "authenticated"){
        const { name, id, email } = res.data.user;
        console.log("auth")
      this.router.navigate(['/home']);
      this.authService.setAuth({ name, id, email,isLoggedIn:true });
      }
    }).catch((err: any)=>{
      console.log(err);
    })
  } 
  onRegister(){
    this.router.navigate(['/register']);
  }
}