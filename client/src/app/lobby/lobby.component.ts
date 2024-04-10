import { Component, Signal, effect } from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { RoomDto } from '../../../libs/api-connector/src/model/room-dto';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent {
  public room: Signal<RoomDto | undefined>;

  constructor(
    public readonly store: AppStore,
    private readonly router: Router
  ) {
    this.room = store.currentRoom;
    effect(() => this.room() == null && this.router.navigate(['']));

    effect(() => {
      if (this.room()?.status === 'START') {
        this.router.navigate(['editor']);
      }
    });

    store.streamUpdates();
  }

  public startGame() {
    this.store.startGame();
  }
}
