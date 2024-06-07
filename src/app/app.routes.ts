import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
    {path:'login',loadComponent:()=>{return import('./component/login/login.component').then((com) => com.LoginComponent);}},
    {path:'register',loadComponent:()=>{return import('./component/register/register.component').then((com) => com.RegisterComponent);}},
    {path:'home',component:HomeComponent},
    {path:"**",redirectTo:'home',pathMatch:'full'},
];