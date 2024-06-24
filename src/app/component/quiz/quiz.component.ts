import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoteService } from '../../services/noteService';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { NavbarComponent } from '../navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { BookTile } from '../home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
export interface Note {
  id: string;
  content: string;
}
export interface UpdatedNote{
    id:string;
    newContent:string;
}
@Component({
  standalone: true,
  selector: 'app-note',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule,
    NavbarComponent,
    RouterLink,
    MatIconModule,MatCardModule, MatButtonModule
]
})
export class QuizComponent implements OnInit {
  note: Note = { id: '', content: '' };
  editMode: boolean = false;
  editedContent: string = '';
  previousContent:string='';
  noteId: string | null = '';
  book:BookTile={
    id: '',
    cols: 0,
    rows: 0,
    text: '',
    link: '',
    name: '',
    totalPages: 0,
    pagesRead: 0,
    imageRef: '',
    ownerId: '',
    author: ''
  };
  constructor(private route: ActivatedRoute, private noteService: NoteService,private cdr: ChangeDetectorRef,private markdownService: MarkdownService,private bookService: BookService) {}

  ngOnInit() {
    this.noteId = this.route.snapshot.paramMap.get('id');
    if (this.noteId) {
      this.noteService.getNoteById(this.noteId).subscribe(
        (note) => {
          this.note = note;
          this.editedContent = note.content;
          this.previousContent = note.content;
          this.markdownService.reload();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching note:', error);
        }
      );
      this.bookService.getBookById(this.noteId).subscribe(
        (book)=>{
          this.book = book;
        }
      )
    } else {
      console.log('No note id in query so could not return a result');
    }
  }
 
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
cancel(){
    this.note.content = this.previousContent;
    this.toggleEditMode();
}
calculateProgressWidth(){
  if( this.book.pagesRead > this.book.totalPages){
    return 100
  }else{
    return (this.book.pagesRead / this.book.totalPages)*100
  }
}
  saveNote() {
    this.previousContent=this.note.content;
    this.toggleEditMode();
    if (this.noteId) {
        const updatedNote:UpdatedNote={
            id: this.noteId,
            newContent: this.note.content,
        }
      this.noteService.updateNote(this.noteId,this.note.content).subscribe(
        (response) => {
          console.log('Note updated:', updatedNote);
        },
        (error) => {
          console.error('Error updating note:', error);
        }
      );
    } else {
      console.log('Cannot save a note without an id');
    }
  }
}
