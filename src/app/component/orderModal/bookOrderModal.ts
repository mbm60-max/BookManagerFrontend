import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BookOrder } from '../home/home.component';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { convertToOrderedString } from '../../utils/bookOrderTostring';

@Component({
  standalone:true,
  selector: 'app-book-edit-modal',
  templateUrl: './bookOrderModal.html',
  styleUrls: ['./bookOrderModal.scss'],
  imports:[FormsModule,CdkDropList, CdkDrag],
})
export class BookOrderModal {
    orderList: BookOrder[]=[];
  constructor(
    public dialogRef: MatDialogRef<BookOrderModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const item = data[key];
          this.orderList.push({
            bookId: item.bookId,
            ownerId: item.ownerId,
            index: parseInt(key), // Use the key as the index
            name: item.name,
          });
        }
      }
  }

  onSubmit(): void {
    this.dialogRef.close(this.orderList);
  }

  onClose(): void {
    this.dialogRef.close();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.orderList, event.previousIndex, event.currentIndex);
  }
}
