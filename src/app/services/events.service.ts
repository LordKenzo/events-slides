import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { Event } from './../models/Event';
import {fakeData} from './../data/events-data';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public eventSelected: Event;

  constructor() { }

  loadEvents(): Observable<Event[]> {
    return of(fakeData);
  }
}
