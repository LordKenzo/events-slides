import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Event } from './../../models/Event';
import { EventService } from './../../services/events.service';

@Component({
  selector: 'event-shell',
  templateUrl: './event-shell.component.html'
})

export class EventShellComponent implements OnInit, OnDestroy {

  events: Event[];
  filteredEvents: Event[];
  event: Event;
  eventSelectedB$: Event;
  subscription: Subscription;
  eventsSubscription: Subscription;

  constructor(public eventService: EventService) { }

  ngOnInit() {
    this.eventsSubscription = this.eventService.loadEvents().subscribe(
      events => {
        this.events = events;
        this.filteredEvents = this.events;
      }
    );
    this.subscription = this.eventService.eventSelected$.subscribe(
      data => this.event  = data
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  handleEventSelection(event: Event) {
    this.eventService.selectEvent(event);
  }

  handleFilter(filter: string) {
    this.performFilter(filter);
  }

  performFilter(filter?: string) {
    if (filter) {
      this.filteredEvents = this.events.filter(
        (event: Event) => event.title.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1
      );
    } else {
      this.filteredEvents = this.events;
    }
  }
}
