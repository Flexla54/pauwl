import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { InputCardComponent } from './input-card/input-card.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'join/user',
    component: InputCardComponent,
  },
];
