import { Injectable } from '@angular/core';
import { CalendarTile, Months } from '../component/calendar/calendar.component';
import { BookTile, BookOrder } from '../component/home/home.component';

@Injectable({
  providedIn: 'root'
})

export class CalendarService {
  days:CalendarTile[]=[];
  booksInOrder:BookTile[]=[];
  book1:BookTile|null=null;
  book2:BookTile|null=null;
  currentDate:Date|null=null;
  book1PagesToGo:number=-1;
  book2PagesToGo:number=-1;
  bookPagesParsed:number[]=[];
  constructor() {
    this.days=[];
    this.booksInOrder=[];
  }
  getDays(currentMonth:Months,  books:BookTile[],bookOrder:BookOrder[]){
    let month = currentMonth;
    this.currentDate = new Date();
    for (let order of bookOrder) {
        const matchingBooks = books.filter(book => book.id === order.bookId);
        if (matchingBooks.length > 0) {
            this.booksInOrder.push(matchingBooks[0]);
        }
    }
    let index1 = 0;
    let index2 =1;
    let totalBooks = this.booksInOrder.length;
    while(index1 < totalBooks && index2 < totalBooks){

        if(this.booksInOrder[index1]){
            this.book1 = this.booksInOrder[index1];
        }else{
            console.log("error no books to use in order");
        }
        if(this.booksInOrder[index2]){
            this.book2 = this.booksInOrder[index2];
        }else{
            console.log("error no books to use in order");
        }
        if(this.book1 && this.book2){
            if(!this.bookPagesParsed[index1]){
                this.bookPagesParsed[index1]=0;
            }
            if(!this.bookPagesParsed[index2]){
                this.bookPagesParsed[index2]=0;
            }
            this.book1PagesToGo = this.book1.totalPages - this.book1.pagesRead - this.bookPagesParsed[index1];
            this.book2PagesToGo = this.book2.totalPages - this.book2.pagesRead- this.bookPagesParsed[index2];//when a book is switched it will reset the pages read count so we must remember how much hs been seen already
            while(this.book1PagesToGo > 0 && this.book2PagesToGo > 0){

                const monthIndex = Object.values(Months).indexOf(currentMonth);
                if (this.currentDate.getMonth() !== monthIndex) {
                    const nextMonthIndex = (monthIndex + 1) % 12;
                    currentMonth = Object.values(Months)[nextMonthIndex];
                    month = currentMonth;
                    this.currentDate.setMonth(nextMonthIndex);
                }
                const dateAsString1 =this.formatDate(this.currentDate);
                this.currentDate.setDate(this.currentDate.getDate() + 1)
                if (this.currentDate.getMonth() !== monthIndex) {
                    const nextMonthIndex = (monthIndex + 1) % 12;
                    currentMonth = Object.values(Months)[nextMonthIndex];
                    month = currentMonth;
                    this.currentDate.setMonth(nextMonthIndex);
                }
                const dateAsString2 = this.formatDate(this.currentDate);
                this.currentDate.setDate(this.currentDate.getDate() + 1)

                const dayTile1: CalendarTile = {
                    month: month,
                    dateString: dateAsString1,
                    bookToReadId: this.book1.id,
                    bookToReadName: this.book1.name,
                };
                const dayTile2: CalendarTile = {
                    month: month,
                    dateString: dateAsString2,
                    bookToReadId: this.book2.id,
                    bookToReadName: this.book2.name,
                };
                this.book1PagesToGo-=10;
                this.bookPagesParsed[index1]+=10;
                this.bookPagesParsed[index2]+=10;
                this.days.push(dayTile1);
                this.days.push(dayTile2);
            }
        }
        if(this.book1PagesToGo <=0){
            index1=index2;//switch book1 and 2
            index2+=1;//move book2 to next book along
        }else if(this.book2PagesToGo <=0){
            index2+=1;
        }
        else{
            console.log("Both books have no pages left");
            return  this.days;
        }
    }
    if(index1 <totalBooks && index2 >= totalBooks){
        if(this.booksInOrder[index1]){
            this.book1 = this.booksInOrder[index1];
            this.book1PagesToGo = this.book1.totalPages - this.book1.pagesRead - this.bookPagesParsed[index1];
            while(this.book1PagesToGo >0){

                const monthIndex = Object.values(Months).indexOf(currentMonth);
                if (this.currentDate.getMonth() !== monthIndex) {
                    const nextMonthIndex = (monthIndex + 1) % 12;
                    currentMonth = Object.values(Months)[nextMonthIndex];
                    month = currentMonth;
                    this.currentDate.setMonth(nextMonthIndex);
                }
                const dateAsString =this.formatDate(this.currentDate);
                this.currentDate.setDate(this.currentDate.getDate() + 1)

                const dayTile1: CalendarTile = {
                    month: month,
                    dateString: dateAsString,
                    bookToReadId: this.book1.id,
                    bookToReadName: this.book1.name,
                };
                this.book1PagesToGo-=10;
                this.bookPagesParsed[index1]+=10;
                this.days.push(dayTile1);
            }
        }else{
            console.log("error no books to use in order");
        }
    }
    console.log("First attempt days",this.days);
    return this.days;
  }
  

  private formatDate(date: Date): string {
    const day = date.getDate();
    const suffix = this.getDaySuffix(day);
    if(this.currentDate){
        const monthIndex = this.currentDate.getMonth();
        const month = Months[Object.keys(Months)[monthIndex] as keyof typeof Months];
        const year = date.getFullYear();
        return `${day}${suffix} ${month} ${year}`;
    }
    return 'no current date';
  }

  private getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
