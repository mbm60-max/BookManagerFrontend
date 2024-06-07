import {Component, OnInit} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { AuthProps, AuthService } from '../../services/auth.service';
  
  export interface Tile {
    cols: number;
    rows: number;
    text: string;
    link:string;
  }
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatGridListModule,RouterLink,NgForOf,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  authStatus: AuthProps = {
    email: '',
    name: '',
    id: '',
    isLoggedIn: false,
  };

  tilesLeft: Tile[] = [];
  tilesRight: Tile[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.updateTiles(); // Initially update tiles
  }
  
  ngOnInit() {
    this.authStatus = this.authService.getStatus();
    this.updateTiles(); 

  }
  updateTiles() {
    this.tilesLeft = [
      { text: 'HOME', cols: 2, rows: 1,link: '/home' },
      {text: 'RULES', cols: 2, rows: 1,link: '/home' },
    ];
    this.tilesRight =[
      { text: this.authStatus.isLoggedIn ? 'LOGOUT' : 'LOGIN', cols: 4, rows: 1,link: '/login' }
    ]
  }
 

  logout() {
    //replace with auth service method to signout
    this.authService.setAuth({email: '',
    name: '',
    id: '',
    isLoggedIn: false})
  }
}