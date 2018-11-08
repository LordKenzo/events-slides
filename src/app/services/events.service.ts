import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { Event } from './../models/Event';
import {fakeData} from './../data/events-data';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventEmit: (event: Event) => void;
  public eventSelected$: Observable<Event> = new Observable( observer => {
    this.eventEmit = (event: Event) => observer.next(event);
  });

  constructor() { }

  loadEvents(): Observable<Event[]> {
    return of(fakeData);
  }

  selectEvent(event: Event) {
    this.eventEmit(event);
  }
}
