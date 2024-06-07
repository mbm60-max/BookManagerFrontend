import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
registerForm!:FormGroup;
constructor(private formBuilder:FormBuilder,private router:Router){
  this.registerForm=this.formBuilder.group({
    email:formBuilder.control('',[Validators.required,Validators.email, Validators.minLength(5)]),
    password:formBuilder.control('',[Validators.required, Validators.minLength(7)]),
})}
public onSubmit(){
    //call http method t request registration and handle response
  (this.registerForm.value.email,this.registerForm.value.password).then((res: any)=>{
  }).catch((err: any)=>{
    console.log(err);
  })
}
onLogin(){
  this.router.navigate(['/login']);
}
}