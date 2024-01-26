import { Component, Signal, effect } from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { RoomDto } from '../../../libs/api-connector/src/model/room-dto';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public rooms: Signal<RoomDto[]>;

  constructor(public readonly store: AppStore) {
    this.rooms = store.rooms;
    effect(() => console.log(store.rooms()));
  }

  ngOnInit() {
    this.store.loadRooms();
  }

  public joinGame(room: RoomDto) {
    this.store.saveJoiningRoom(room);
  }
}
