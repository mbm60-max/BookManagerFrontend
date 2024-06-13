import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UpdatedNote } from '../component/note/note.component';
import { BookOrder } from '../component/home/home.component';


export interface Note{
  id:string,
  content:string,
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:5058/order';
  
  constructor(private http: HttpClient) {}

  getOrderById(UserId:string):Observable<any>{
    const url = `${this.baseUrl}/${UserId}`;
    console.log("attempting to get order by user id")
    return this.http.get<any>(url);
  }
  updateOrderById(UserId: string, order:BookOrder[]): Observable<any> {
    const url = `${this.baseUrl}/${UserId}`;
    console.log("Attempting to update order by user id");
    
    // Log the orderJsonAsString for debugging
    console.log("Order JSON:", order);
    return this.http.put<any>(url, order,);
  }

  deleteOrder(UserId:string):Observable<any>{
    const url = `${this.baseUrl}/${UserId}`;
    console.log("attempting to delete order by user id")
    return this.http.delete<any>(url)
  }
}