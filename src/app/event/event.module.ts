import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { EventShellComponent } from './container/event-shell/event-shell.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventShellComponent,
    EventDetailsComponent,
    EventListComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule
   ],
  exports: [],
  providers: [],
})
export class EventModule {}
