import { Component, Signal, effect } from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { RoomDto } from '../../../libs/api-connector/src/model/room-dto';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  public room: Signal<RoomDto | undefined> | undefined;
  public debugRoom: RoomDto = {
    id: '123456-1234-1234-12345678',
    name: 'michaels mediocre mansion',
    rounds: [],
    numberOfRounds: 5,
    status: 'WAITING',
    players: [
      {
        id: '111111-1111-1111-11111111',
        name: 'Michael',
        avatarUrl: 'https://avatars.githubusercontent.com/u/11111111'
      },
      {
        id: '222222-2222-2222-22222222',
        name: 'Stevens',
        avatarUrl: 'https://avatars.githubusercontent.com/u/22222222'
      }
    ]
  }

  constructor(public readonly store: AppStore) {
    this.room = store.currentRoom;
    effect(() => console.log(store.rooms()));

    store.streamUpdates();
  }

  public startGame() {
    //TODO: implement
    alert('Totally starting the game right now ;)');
  }
}
