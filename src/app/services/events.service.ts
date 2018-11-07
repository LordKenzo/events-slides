import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';

import { Event } from './../models/Event';
import {fakeData} from './../data/events-data';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // è privato perchè non voglio che venga creati eventi dall'esterno ma solo dal service
  private eventSelectedSource = new Subject<Event>();
  public eventSelected$ = this.eventSelectedSource.asObservable();

  constructor() { }

  loadEvents(): Observable<Event[]> {
    return of(fakeData);
  }

  selectEvent(event: Event) {
    // con next emetto l'evento e passo il dato event
    this.eventSelectedSource.next(event);
  }
}
