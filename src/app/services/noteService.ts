import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UpdatedNote } from '../component/note/note.component';
import { environment } from '../../environments/environments';


export interface Note{
  id:string,
  content:string,
}
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private baseUrl = environment.baseUrl + '/notes';
  constructor(private http: HttpClient) {}

  getNoteById(NoteId:string):Observable<any>{
    const url = `${this.baseUrl}/${NoteId}`;
    return this.http.get<any>(url);
  }
  updateNote(NoteId: string, newContent: string): Observable<any> {
    const url = `${this.baseUrl}/${NoteId}`;
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const updatedNote = {
      content: newContent
    };
  
    return this.http.put<any>(url, updatedNote, { headers });
  }
  
  
  deleteNote(NoteId:string):Observable<any>{
    const url = `${this.baseUrl}/${NoteId}`;
    return this.http.delete<any>(url)
  }
}