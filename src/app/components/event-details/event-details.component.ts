import { Component, Input } from '@angular/core';

import { Event } from './../../models/Event';

@Component({
  selector: 'event-details',
  templateUrl: 'event-details.component.html'
})

export class EventDetailsComponent {

  @Input() event: Event;

  constructor() { }

}
