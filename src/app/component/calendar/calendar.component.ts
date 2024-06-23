import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  ReactiveFormsModule} from '@angular/forms';

import {ActivatedRoute, RouterModule } from '@angular/router';
import { BookOrder, BookTile } from '../home/home.component';
import { OrderService } from '../../services/order.service';
import { BookService } from '../../services/book.service';
import { CalendarService } from '../../services/calendar.service';

export interface CalendarTile{
    dateString:string;
    bookToReadId:string;
    bookToReadName:string;
    month:Months;
}
export enum Months {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December"
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  books:BookTile[]=[];
  bookOrder:BookOrder[]=[]
  errorMessage:string="";
  userId: string | null = '';
  currentMonth:Months|null=null;
  days:CalendarTile[]=[];
  constructor(private orderService:OrderService,private route: ActivatedRoute,private bookService:BookService,private calendarService:CalendarService){
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if(this.userId){
        const order = await this.getOrder(this.userId);
        const bookList = await this.updateBookList(this.userId);
        this.currentMonth = this.getUTCMonthAsEnum();
        this.calendarService.getDays(this.currentMonth,this.books,this.bookOrder)
    }
  }

  
  getUTCMonthAsEnum(): Months {
    const monthIndex = new Date().getUTCMonth();
    return Months[Object.keys(Months)[monthIndex] as keyof typeof Months];
    }
    
    async updateBookList(userId: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.bookService.getBooks(userId).subscribe(
          (response) => {
            console.log('called update books with arguments', response);
            this.books = response.map((book: { cols: number; rows: number; }) => {
              book.cols = 3;
              book.rows = 3;
              return book;
            });
            this.books = response;
            if (this.books.length === 0) {
              this.errorMessage = "You don't have any books available, please add one";
            } else {
              this.errorMessage = "";
            }
            resolve();
          },
          (error) => {
            this.errorMessage = "Failed to find books, try adding one above.";
            console.error('Error fetching books:', error);
            reject(error);
          }
        );
      });
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
  async getOrder(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.orderService.getOrderById(id).subscribe(
        (response) => {
          this.bookOrder = this.parseBookOrders(response);
          console.log("order", response);
          if (this.bookOrder.length === 0) {
            this.errorMessage = "You don't have any books available, please add one";
          } else {
            this.errorMessage = "";
          }
          resolve();
        },
        (error) => {
          this.errorMessage = "Failed to find books order, try adding a book above.";
          console.error('Error fetching book order:', error);
          reject(error);
        }
      );
    });
  }
}