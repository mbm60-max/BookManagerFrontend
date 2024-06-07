import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthProps, AuthService } from '../../services/auth.service';
import { NavbarComponent, Tile } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule,NgForOf,NgIf,NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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
  
  updateTiles() {
    this.tilesLeft = [
    ];
    this.tilesRight =[
      { text: 'HOME', cols: 2, rows: 1,link: '/home' },
      {text: 'RULES', cols: 2, rows: 1,link: '/home' },
      {text: 'SUPPORT', cols: 2, rows: 1,link: '/home' },
      {text: 'GITHUB', cols: 2, rows: 1,link: 'https://github.com/mbm60-max/AngularGame' },
      {text: 'LICENSE', cols: 2, rows: 1,link: '/home' },
    ]
  }
  ngOnInit() {
    this.authStatus = this.authService.getStatus();
    this.updateTiles(); 
  }
}