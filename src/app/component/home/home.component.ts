import {  Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthProps, AuthService } from '../../services/auth.service';
import { NavbarComponent, Tile } from '../navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { BookEditModal } from '../editModal/bookEditModal';
import { BookEditModalService } from '../../services/bookEditModal.service';
import { BookCreateModalService } from '../../services/bookCreateService';
import { BookDeleteModalService } from '../../services/bookDelete.service';
import { Note, NoteService } from '../../services/noteService';
import { BookOrderModalService } from '../../services/bookOrderModal.service';
import { OrderService } from '../../services/order.service';
import { convertToOrderedString, removeAndReindex } from '../../utils/bookOrderTostring';

export interface BookTile {
  id:string;
  cols: number;
  rows: number;
  text: string;
  link:string;
  name:string,
  totalPages:number,
  pagesRead:number,
  imageRef:string,
  ownerId:string,
  author:string,
}
export interface BookOrder{
  bookId:string,
  ownerId:string,
  index:number,
  name:string,
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule,NgForOf,NgIf,NavbarComponent,RouterLink],
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
  books:BookTile[]=[];
  errorMessage:string="";
  bookOrders:BookOrder[] = [];
  constructor(private authService: AuthService, private router: Router,private bookService:BookService,private bookEditService:BookEditModalService,private bookCreateService:BookCreateModalService,private bookDeleteService:BookDeleteModalService,private noteService:NoteService,private bookOrderService:BookOrderModalService,private orderService:OrderService) {
  }
  updateBookList(): void {
  
    this.bookService.getBooks(this.authStatus.id).subscribe(
      (response) => {  
        console.log('called upate books with arguments',response)
        this.books = response.map((book: { cols: number; rows: number; }) => {
          // Assign arbitrary values to cols and rows properties
          book.cols = 2 // Random number between 1 and 5 for cols
          book.rows = 2; // Random number between 1 and 3 for rows
          return book;
        });
        this.books = response;
        if (this.books.length === 0) {
          this.errorMessage = "You don't have any books available, please add one";
        } else {
          this.errorMessage = "";
        }
      },
      (error) => {
        this.errorMessage = "Failed to find books, try adding one above."
        console.error('Error fetching books:', error);
      }
    );
  }
  ngOnInit() {
    this.authStatus = this.authService.getStatus();
    if(this.authStatus.isLoggedIn){
      this.updateBookList();
      this.getOrder();
       // Subscribe to the bookUpdated$ observable
       this.bookEditService.bookUpdated$.subscribe(updatedBook => {
        const indexBook = this.books.findIndex(book => book.id === updatedBook.id);
        const indexOrder = this.books.findIndex(book => book.id === updatedBook.id);
        if (indexBook !== -1 && indexOrder !== -1) {
          // Replace the old book data with the updated book data in the frontend and in order
          this.books[indexBook] = updatedBook;
          let updatedOrder =this.bookOrders;
          let orderToEdit = updatedOrder[indexOrder];
          orderToEdit.name = updatedBook.name;
          this.bookOrders[indexOrder] = orderToEdit;
          this.orderService.updateOrderById(this.authStatus.id, this.bookOrders).subscribe(
            x => {
             console.log("updated",this.bookOrders)
            },
            error => {
              console.error('Error updating order:', error);
            }
          );
        }
      });
      this.bookCreateService.bookCreated$.subscribe(newBook => {
        newBook={ ...newBook,
          cols: 2,
          rows: 2,
         }
        this.books=[...this.books,newBook];
        this.getOrder();
      });
      this.bookDeleteService.bookDeleted$.subscribe(newOrder => {
        console.log(newOrder)
        this.bookOrders =newOrder;
      });
      this.bookOrderService.orderUpdated$.subscribe(updatedOrder =>{
        this.bookOrders = updatedOrder;
        this.updateBookList();
      })
      this.getOrder();
    }
  }
  
  createBook(){
    this.bookCreateService.openBookCreateModal(this.authStatus.id,this.bookOrders);
  }
  editBook(book:BookTile){
    this.bookEditService.openBookEditModal(book);
  }
  deleteBook(book:BookTile){
    // Open the delete modal
  this.bookDeleteService.openBookDeleteModal(book,this.bookOrders,this.authStatus.id,this.books);
  }
  editOrder(bookOrders:BookOrder []){
    this.bookOrderService.openBookOrderModal(this.authStatus.id,bookOrders);
  }
  parseBookOrders(order:any):BookOrder[]{
    const bookOrders:BookOrder []=[];
    if (order){
      let unparsedList = order.orderJsonAsString as string;
      //unparsedList= unparsedList.OrderJsonAsString;
      if (unparsedList.startsWith("\"") && unparsedList.endsWith("\"")) {
        unparsedList = unparsedList.slice(1, -1); // Remove surrounding quotes
      }
      unparsedList = unparsedList.replace(/\\/g, ''); // Remove escape characters

      try {
        const parsedData = JSON.parse(unparsedList); 
        for (const key in parsedData) {
          if (parsedData.hasOwnProperty(key)) {
            const orderData = parsedData[key];
            const bookOrder: BookOrder = {
              bookId: orderData.bookId,
              ownerId: orderData.ownerId,
              index: parseInt(key), // Assuming the index is provided in the JSON string
              name: orderData.name,
            };
            bookOrders.push(bookOrder); 
          }
        }
        return bookOrders;
      } catch (error) {
        console.error("Error parsing JSON string:", error);
        return[];
      }
    }else{
      console.log("No order for the book")
      return[];
    }
  }
  async getOrder(){
    this.orderService.getOrderById(this.authStatus.id).subscribe(
      (response) => {
        this.bookOrders = this.parseBookOrders(response);
        console.log("order",response)
        if (this.bookOrders.length === 0) {
          this.errorMessage = "You don't have any books available, please add one";
        } else {
          this.errorMessage = "";
        }
      },
      (error) => {
        this.errorMessage = "Failed to find books order, try adding a book above."
        console.error('Error fetching book order:', error);
      }
    );
  }
}