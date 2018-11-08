import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { EventShellComponent } from './container/event-shell/event-shell.component';

const routes: Route[] = [
  {
    path: '',
    component: EventShellComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [],
})
export class EventRoutingModule { }
