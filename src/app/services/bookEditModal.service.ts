import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from './book.service';
import { BookEditModal } from '../component/editModal/bookEditModal';
import { BookTile } from '../component/home/home.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookEditModalService {
  private bookUpdatedSubject = new Subject<BookTile>();
  bookUpdated$ = this.bookUpdatedSubject.asObservable();
  constructor(private dialog: MatDialog, private bookService: BookService) { }

  openBookEditModal(bookData: any): void {
    const dialogRef = this.dialog.open(BookEditModal, {
      width: '400px',
      height:'300px',
      data: { ...bookData } // Pass the book data to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        // Call a method to update the book list in the parent component
        this.bookService.updateBook(result.id, result).subscribe(
          result => {
            console.log('Book updated:', result);
          },
          error => {
            console.error('Error updating book:', error);
          }
        );
        this.bookUpdatedSubject.next(result);
      }
    });
  }
}
