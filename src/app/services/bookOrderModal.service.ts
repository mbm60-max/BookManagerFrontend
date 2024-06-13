
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookOrder, BookTile } from '../component/home/home.component';
import { OrderService } from './order.service';
import { BookOrderModal } from '../component/orderModal/bookOrderModal';
import { convertToOrderedString, reindex } from '../utils/bookOrderTostring';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookOrderModalService {
    private orderUpdatedSubject = new Subject<BookOrder[]>();
    orderUpdated$ = this.orderUpdatedSubject.asObservable();
  constructor(private dialog: MatDialog, private orderService: OrderService) { }
    private userId:string="";
  openBookOrderModal(userId:string,bookOrders:BookOrder []): void {
    this.userId =userId;
    const dialogRef = this.dialog.open(BookOrderModal, {
      width: '250px',
      data: { ...bookOrders } 
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
            console.log("should be trying to update order on changre",result)
          // Call a method to update the book list in the parent component
          this.orderService.updateOrderById(this.userId, result).subscribe(
            result => {
              console.log('Order updated:',  reindex(result));
            },
            error => {
              console.error('Error order book:', error);
            }
          );
          this.orderUpdatedSubject.next(reindex(result));
        }
      });
  }
}
