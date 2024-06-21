import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone:true,
  selector: 'app-book-crete-modal',
  templateUrl: './bookCreateModal.html',
  styleUrls: ['./bookCreateModal.scss'],
  imports:[FormsModule,MatIconModule,MatButtonModule],
})
export class BookCreateModal {
  constructor(
    public dialogRef: MatDialogRef<BookCreateModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
}
