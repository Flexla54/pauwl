import { Component, Signal, effect } from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { RoomDto } from '../../../libs/api-connector/src/model/room-dto';

import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public rooms: Signal<RoomDto[]>;

  constructor(public readonly store: AppStore) {
    this.rooms = store.waitingRooms;
  }

  ngOnInit() {
    this.store.loadRooms();
  }
}
