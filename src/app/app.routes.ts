import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { NoteComponent } from './component/note/note.component';

export const routes: Routes = [
    {path:'login',loadComponent:()=>{return import('./component/login/login.component').then((com) => com.LoginComponent);}},
    {path:'register',loadComponent:()=>{return import('./component/register/register.component').then((com) => com.RegisterComponent);}},
    { path: 'notes/:id', loadComponent: () => import('./component/note/note.component').then(com => com.NoteComponent) },
    {path:'home',component:HomeComponent},
    {path:"**",redirectTo:'home',pathMatch:'full'},
];