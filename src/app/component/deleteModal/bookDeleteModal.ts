import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  standalone:true,
  selector: 'app-book-edit-modal',
  templateUrl: './bookDeleteModal.html',
  styleUrls: ['./bookDeleteModal.scss'],
  imports:[FormsModule,MatIconModule,MatButtonModule],
})
export class BookDeleteModal {
  constructor(
    public dialogRef: MatDialogRef<BookDeleteModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onSubmit(): void {
    this.dialogRef.close(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
