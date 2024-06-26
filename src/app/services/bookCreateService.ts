import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Book, BookService } from './book.service';
import { BookEditModal } from '../component/editModal/bookEditModal';
import { BookOrder, BookTile } from '../component/home/home.component';
import { Subject } from 'rxjs';
import { OrderService } from './order.service';
import { BookCreateModal } from '../component/createModal/bookCreateModal';

@Injectable({
  providedIn: 'root'
})
export class BookCreateModalService {
  private bookCreatedSubject = new Subject<BookTile>();
  bookCreated$ = this.bookCreatedSubject.asObservable();
  private bookId:string='';
  private bookOrder:BookOrder[]=[];
  private isModalOpen: boolean = false;

  constructor(private dialog: MatDialog, private bookService: BookService,private orderService:OrderService) { }

  openBookCreateModal(ownerId:string,bookOrder:BookOrder[]): void {
    if (this.isModalOpen) {
      return; 
    }
    this.isModalOpen = true;
    const bookData={name:"No Name",author:"No Author",pagesRead:0,totalPages:0,imageRef:"No Image"}
    const dialogRef = this.dialog.open(BookCreateModal, {
      width: '400px',
      height:'300px',
      data: { ...bookData } // Pass the book data to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isModalOpen = false;
      if (result) {
        var book = result;
        book.ownerId = ownerId;
        this.bookService.createBook(result).subscribe(
            createdBook => {
              console.log("inner",createdBook);
                this.bookCreatedSubject.next(book); // Emit the created book
                },
              error => {
                console.error('Error creating book:', error);
              }
            );
      }
    });
  }
}
