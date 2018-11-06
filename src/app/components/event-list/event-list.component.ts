import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EventService } from 'src/app/services/events.service';
import { Event } from './../../models/Event';

@Component({
  selector: 'event-list',
  templateUrl : 'event-list.component.html'
})

export class EventListComponent implements OnInit {

  private events$: Observable<Event[]>;

  constructor(public eventService: EventService) { }

  ngOnInit() {
    this.events$ = this.eventService.loadEvents();
  }

  onSelectedEvent(event: Event) {
    this.eventService.eventSelected = event;
  }
}
