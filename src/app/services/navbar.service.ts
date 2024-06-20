import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private bookAddedSubject = new Subject<void>();
  private orderChangedSubject = new Subject<void>();
 
  bookAdded$ = this.bookAddedSubject.asObservable();
  orderChanged$ = this.orderChangedSubject.asObservable();

  notifyBookAdded() {
    this.bookAddedSubject.next();
  }

  notifyOrderChanged() {
    this.orderChangedSubject.next();
  }
}
