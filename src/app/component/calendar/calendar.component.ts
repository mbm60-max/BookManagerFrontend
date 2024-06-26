import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  ReactiveFormsModule} from '@angular/forms';

import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookOrder, BookTile } from '../home/home.component';
import { OrderService } from '../../services/order.service';
import { BookService } from '../../services/book.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CalendarService } from '../../services/calendar.service';

export interface CalendarTile{
    dateString:string;
    bookToReadId:string;
    bookToReadName:string;
    month:Months|null;
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
    December = "December",
    None="None"
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule,MatIconModule,MatCardModule, MatButtonModule],
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
  weeks: CalendarTile[][] = [];
  year:number|null = null;
  weekIndex:number=0;
  firstDayIndex:number=0;
  lastDayIndex:number=0;
  canGoBack:boolean=false;
  canGoForward:boolean=false;
  constructor(private orderService:OrderService,private route: ActivatedRoute,private bookService:BookService,private calendarService:CalendarService,private router: Router){
    this.books=[];
    this.bookOrder=[];
    this.weeks=[];
    this.days=[];
    this.currentMonth=null;
    this.days=[];
    this.weeks= [];
    this.year =null;
    this.weekIndex=0;
    this.firstDayIndex=0;
    this.lastDayIndex=0;
    this.canGoBack=false;
    this.canGoForward=false;
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if(this.userId){
        await this.getOrder(this.userId);
        await this.updateBookList(this.userId);
        this.currentMonth = this.getUTCMonthAsEnum();
        this.year= new Date().getUTCFullYear();
        this.days = this.calendarService.getDays(this.currentMonth,this.books,this.bookOrder);
        this.generateWeeks(this.weekIndex);
        let newWeekIndex = this.weekIndex +14;
        if(newWeekIndex<=this.days.length-1){
          this.canGoForward=true;
        }
    }
  }

  goForward2Weeks(){
    
    let newWeekIndex = this.weekIndex +14;
    
    if(newWeekIndex>=14){
      this.canGoBack=true;
    }else{
      this.canGoBack=false;
    }
    if(newWeekIndex+14<=this.days.length-1){
      this.canGoForward=true;
    }else{
      this.canGoForward=false;
    }
    this.generateWeeks(Math.min(Math.max(newWeekIndex,0),this.days.length+6));
    this.weekIndex = (Math.min(Math.max(newWeekIndex,0),this.days.length+6));
  }
  viewNotes(bookId:string){
    if(bookId!=""){
      this.router.navigate(['/notes', bookId]);
    }
  }
  goBackward2Weeks(){
    let newWeekIndex = this.weekIndex -14;
    if(newWeekIndex<=this.days.length-14){
      this.canGoForward=true;
    }else{
      this.canGoForward=false;
    }
    if(newWeekIndex-14>=0){
      this.canGoBack=true;
    }else{
      this.canGoBack=false;
    }
    this.generateWeeks(Math.min(Math.max(newWeekIndex,0),this.days.length+6));
    this.weekIndex = (Math.min(Math.max(newWeekIndex,0),this.days.length+6));
  }

  getUTCMonthAsEnum(): Months {
    const monthIndex = new Date().getUTCMonth();
    return Months[Object.keys(Months)[monthIndex] as keyof typeof Months];
    }
    getLastDay(lastDayIndex:number,weekIndex:number){
      if(!this.days[weekIndex+lastDayIndex-1]){
        return "";
      }
      return this.days[weekIndex+lastDayIndex-1].dateString;
    }
    getFirstDay(weekIndex:number){
      if (!this.days[weekIndex].dateString) {
        return '';
    }
      return this.days[weekIndex].dateString;
    }
    generateWeeks(startIndex:number) {
      this.weeks=[];
      this.lastDayIndex=0;
      const totalWeeks = 2;
      const daysInWeek = 7;
      let dayIndex = 0;

      for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
          const week: CalendarTile[] = [];

          for (let dayIndexInWeek = 0; dayIndexInWeek < daysInWeek; dayIndexInWeek++) {
            const fullIndex = dayIndex+startIndex;
              if (fullIndex < this.days.length) {
                  week.push(this.days[fullIndex]);
                  dayIndex++;
                  this.lastDayIndex++;
              } else {
                  week.push({ month: null, dateString: '', bookToReadId: '', bookToReadName: '' }); // Empty day
              }
          }

          this.weeks.push(week);
      }
  }
    
    async updateBookList(userId: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.bookService.getBooks(userId).subscribe(
          (response) => {
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
  isToday(dateString: string): boolean {
    const todayString = this.getTodayUtcDateString();
    return dateString.includes(todayString);
  }

  getTodayUtcDateString(): string {
    const today = new Date();
    const utcDay = today.getUTCDate();
    const utcMonth = today.getUTCMonth() + 1;
    const utcYear = today.getUTCFullYear();

    const dayString = utcDay < 10 ? '0' + utcDay : utcDay.toString();
    const monthString = utcMonth < 10 ? '0' + utcMonth : utcMonth.toString();

    const dateSuffix = this.getDaySuffix(utcDay);
    return `${utcDay}${dateSuffix} ${this.getMonthName(utcMonth)}`;
  }

  getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex - 1];
  }
}