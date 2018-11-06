import { Component, OnInit } from '@angular/core';

import { Event } from './../../models/Event';
import { EventService } from 'src/app/services/events.service';

@Component({
  selector: 'event-shell',
  templateUrl: './event-shell.component.html'
})

export class EventShellComponent implements OnInit {

  constructor(public eventService: EventService) { }

  ngOnInit() { }

  handleEventSelected(event: Event) {
    this.eventService.eventSelected = event;
  }
}
