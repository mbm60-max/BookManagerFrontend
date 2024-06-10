import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book{
  Author:string,
}
@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:5058/books';
  
  constructor(private http: HttpClient) {}

  getBooks(OwnerId:string): Observable<any> {
    const url = `${this.baseUrl}`;
    console.log("attempting to get all books")
    return this.http.get<any>(url);
  }
  createBook(book:Book):Observable<any>{
    const url = `${this.baseUrl}`;
    const body = {book}
    return this.http.post<any>(url,body)
  }
  getBookById(BookId:string):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    console.log("attempting to get book by id")
    return this.http.get<any>(url);
  }
  updateBooks(BookId:string,book:Book):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    const body = {book}
    console.log("attempting to update book by id")
    return this.http.post<any>(url,body)
  }
  deleteBooks(BookId:string,book:Book):Observable<any>{
    const url = `${this.baseUrl}/${BookId}`;
    console.log("attempting to delete book by id")
    return this.http.delete<any>(url)
  }
}
