
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
    private orderResponse:any;
    private isModalOpen: boolean = false;
    orderUpdated$ = this.orderUpdatedSubject.asObservable();
  constructor(private dialog: MatDialog, private orderService: OrderService) { }
    private userId:string="";
  openBookOrderModal(userId:string,bookOrders:BookOrder []): void {
    if (this.isModalOpen) {
      return; 
    }
    this.isModalOpen = true;
    this.userId =userId;
    const dialogRef = this.dialog.open(BookOrderModal, {
      width: '400px',
      height:'500px',
      data: { ...bookOrders } 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isModalOpen = false;
      if (result) {
        // Call a method to update the book list in the parent component
        this.orderService.updateOrderById(this.userId, result).subscribe(
          x => {
            this.orderUpdatedSubject.next(reindex(result));
          },
          error => {
            console.error('Error updating order:', error);
          }
        );
      }
    });
    
  }
}
