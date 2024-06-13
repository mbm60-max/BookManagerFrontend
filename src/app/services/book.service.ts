import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

export interface Book{
  id:string,
  name:string,
  notesId:string,
  totalPages:number,
  pagesRead:number,
  imageRef:string,
  ownerId:string,
  author:string,
}
@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:5058/books';
  
  constructor(private http: HttpClient) {}

  getBooks(OwnerId:string): Observable<any> {
    const url = `${this.baseUrl}/ownedBy/${OwnerId}`;
    console.log("attempting to get all books")
    return this.http.get<any>(url)
  }
 
  createBook(book:Book):Observable<any>{
    const url = `${this.baseUrl}`;
    return this.http.post<any>(url, book).pipe(
      tap(response => {
        if (response) {
          // Update the book object with the returned ID
          book.notesId = response.id;
          book.id = response.id;
        }
      })
    );
  }
  getBookById(BookId:string):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    console.log("attempting to get book by id")
    return this.http.get<any>(url);
  }
  updateBook(BookId:string,book:Book):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    console.log("attempting to update book by id")
    return this.http.put<any>(url,book)
  }
  deleteBook(BookId:string,book:Book):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    console.log("attempting to delete book by id")
    return this.http.delete<any>(url)
  }
}
