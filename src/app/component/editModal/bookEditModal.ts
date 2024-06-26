import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  standalone:true,
  selector: 'app-book-edit-modal',
  templateUrl: './bookEditModal.html',
  styleUrls: ['./bookEditModal.scss'],
  imports:[FormsModule,MatIconModule,MatButtonModule],
})
export class BookEditModal {
  constructor(
    public dialogRef: MatDialogRef<BookEditModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
}
