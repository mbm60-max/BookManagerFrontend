import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UpdatedNote } from '../component/note/note.component';


export interface Note{
  id:string,
  content:string,
}
@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl = 'http://localhost:5058/notes';
  
  constructor(private http: HttpClient) {}

  getNoteById(NoteId:string):Observable<any>{
    const url = `${this.baseUrl}/${NoteId}`;
    console.log("attempting to get note by id")
    return this.http.get<any>(url);
  }
  updateNote(NoteId: string, newContent: string): Observable<any> {
    const url = `${this.baseUrl}/${NoteId}`;
    console.log("Attempting to update note by id");
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const updatedNote = {
      Content: newContent
    };
  
    return this.http.put<any>(url, updatedNote, { headers });
  }
  
  deleteNote(NoteId:string):Observable<any>{
    const url = `${this.baseUrl}/${NoteId}`;
    console.log("attempting to delete note by id")
    return this.http.delete<any>(url)
  }
}