import { Component, OnInit } from '@angular/core';

import { Event } from './../../models/Event';
import { EventService } from 'src/app/services/events.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'event-shell',
  templateUrl: './event-shell.component.html'
})

export class EventShellComponent implements OnInit {

  events$: Observable<Event[]>;
  eventSelected: Event;

  constructor(public eventService: EventService) { }

  ngOnInit() {
    this.events$ = this.eventService.loadEvents();
  }

  handleEventSelection(event: Event) {
    this.eventSelected = event;
  }
}
