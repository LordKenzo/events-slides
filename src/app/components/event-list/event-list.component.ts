import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Event } from './../../models/Event';

@Component({
  selector: 'event-list',
  templateUrl : 'event-list.component.html'
})

export class EventListComponent implements OnInit {

  @Input() events: Event[];
  @Output() selectEvent: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() { }

  ngOnInit() {
  }

  onSelectedEvent(event: Event) {
    this.selectEvent.emit(event);
  }
}
