import { Component, OnInit, OnDestroy } from '@angular/core';

import { Event } from './../../models/Event';
import { EventService } from 'src/app/services/events.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'event-shell',
  templateUrl: './event-shell.component.html'
})

export class EventShellComponent implements OnInit, OnDestroy {

  events$: Observable<Event[]>;
  event: Event;
  eventSelectedB$: Event;
  subscription: Subscription;

  constructor(public eventService: EventService) { }

  ngOnInit() {
    this.events$ = this.eventService.loadEvents();
    this.subscription = this.eventService.eventSelected$.subscribe(
      data => this.event  = data
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleEventSelection(event: Event) {
    this.eventService.selectEvent(event);
  }
}
