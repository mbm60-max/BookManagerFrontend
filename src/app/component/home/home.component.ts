import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthProps, AuthService } from '../../services/auth.service';
import { NavbarComponent, Tile } from '../navbar/navbar.component';
import { BookService } from '../../services/book.service';
export interface Book {
  cols: number;
  rows: number;
  text: string;
  link:string;
}
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
    isLoggedIn: true,
  };
  books:Book[]=[];
  constructor(private authService: AuthService, private router: Router,private bookService:BookService ) {
  }
  updateBookList(): void {
    this.bookService.getBooks(this.authStatus.id).subscribe(
      (response) => {
        this.books = response;
        console.log(this.books);
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }
  ngOnInit() {
    this.authStatus = this.authService.getStatus();
    if(this.authStatus.isLoggedIn){
      this.updateBookList();
    }
  }
}