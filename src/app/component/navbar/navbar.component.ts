import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, AuthProps } from '../../services/auth.service';
import { NavbarService } from '../../services/navbar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  link: string;
  method: string; 
}


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatGridListModule,
    RouterLink,
    NgForOf,
    NgIf,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    RouterLink,
    NgForOf,
    NgIf,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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
  isSmallScreen = false;
  menuOpen=false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private navbarService: NavbarService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.updateTiles();
  }

  ngOnInit() {
    this.authStatus = this.authService.getStatus();
    this.updateTiles();
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    
  }

  updateTiles() {
    this.tilesLeft = [];
    this.tilesRight = [
      { text: 'add', cols: 1, rows: 1, link: '', method: 'createBook' },
      { text: 'edit', cols: 1, rows: 1, link: '', method: 'editOrder' },
      { text: 'logout', cols: 1, rows: 1, link: '/login', method: 'logout' }
    ];
  }
  toggleMenu(){
    this.menuOpen=!this.menuOpen;
  }
  performAction(method: string) {
    switch (method) {
      case 'logout':
        this.logout();
        break;
      case 'createBook':
        this.createBook();
        break;
      case 'editOrder':
        this.editOrder();
        break;
      default:
        console.error(`Method '${method}' not implemented.`);
        break;
    }
  }

  logout() {
    this.authService.setAuth({ email: '', name: '', id: '', isLoggedIn: false });
    this.router.navigate(['/login']);
  }

  createBook() {
    this.navbarService.notifyBookAdded();
  }

  editOrder() {
    this.navbarService.notifyOrderChanged();
  }
}
