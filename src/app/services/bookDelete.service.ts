import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from './book.service';
import { BookEditModal } from '../component/editModal/bookEditModal';
import { BookOrder, BookTile } from '../component/home/home.component';
import { Subject } from 'rxjs';
import { BookDeleteModal } from '../component/deleteModal/bookDeleteModal';
import { NoteService } from './noteService';
import { OrderService } from './order.service';
import { removeAndReindex } from '../utils/bookOrderTostring';

@Injectable({
  providedIn: 'root'
})
export class BookDeleteModalService {
  private bookDeletedSubject = new Subject<BookTile>();
  bookDeleted$ = this.bookDeletedSubject.asObservable();
  constructor(private dialog: MatDialog, private bookService: BookService,private noteService:NoteService,private orderService:OrderService) { }
  private bookId:string='';
  private bookOrder:BookOrder[]=[];
  private userId:string='';
  private books:BookTile []=[];
  openBookDeleteModal(bookData: any,bookOrder:BookOrder[],userId:string,books:BookTile[]): void {
    this.bookId=bookData.id;
    this.bookOrder=bookOrder;
    this.userId=userId;
    this.books=books;
    const dialogRef = this.dialog.open(BookDeleteModal, {
      width: '250px',
      data: { ...bookData } // Pass the book data to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        const book = result;
        // Call a method to update the book list in the parent component
        this.bookService.deleteBook(result.id, result).subscribe(
            result => {
                console.log('Book deleted:', result);
                this.noteService.deleteNote(this.bookId).subscribe(
                    result => {
                        console.log("Note Deleted:", this.bookId);
                        const index = this.books.findIndex(b => b.id === this.bookId);
                        console.log(this.books)
                        if (index !== -1) {
                            console.log("passed index check");
                            this.books.splice(index, 1);
                            console.log("Current order",this.bookOrder)
                            const updatedOrder = removeAndReindex(this.bookOrder, index);
                            console.log("Order to remove", updatedOrder);
                            this.orderService.updateOrderById(userId, updatedOrder).subscribe(
                                result => {
                                    console.log("Order updated:", result);
                                },
                                error => {
                                    console.error('Error updating order:', error);
                                }
                            );
                        }
                        this.bookDeletedSubject.next(book);
                    },
                    error => {
                        console.error('Error deleting notes:', this.bookId);
                    }
                );
            },
            error => {
                console.error('Error deleting book', error);
            }
        );
    }
    
    });
  }
}
