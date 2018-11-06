import { EventService } from './../../services/events.service';
import { Component } from '@angular/core';

@Component({
  selector: 'event-details',
  templateUrl: 'event-details.component.html'
})

export class EventDetailsComponent {

  get event() {
    return this.eventService.eventSelected;
  }

  constructor(public eventService: EventService) { }

}
