import { Component } from '@angular/core';

import { Event } from './../../models/Event';

@Component({
  selector: 'event-details',
  templateUrl: 'event-details.component.html'
})

export class EventDetailsComponent {

  private _event: Event;

  set event(value) {
    this._event = value;
  }
  get event() {
    return this._event;
  }

  constructor() { }

}
