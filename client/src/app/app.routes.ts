import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomOverviewComponent } from './room-overview/room-overview.component';
import { InputCardComponent } from './components/input-card/input-card.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CreateRoomComponent } from './create-room/create-room.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'join/user',
    component: InputCardComponent,
  },
  {
    path: 'setup',
    children: [
      {
        path: 'player',
        component: CreatePlayerComponent,
      },
      {
        path: 'room',
        component: CreateRoomComponent
      }
    ]
  },
  {
    path: 'lobby',
    component: LobbyComponent
  }
];
