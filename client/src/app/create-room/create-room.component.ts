import { Component, OnInit, effect } from '@angular/core';
import { InputCardComponent } from '../components/input-card/input-card.component';
import { FormControl, Validators } from '@angular/forms';
import { AppStore } from '../core/state/app.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [InputCardComponent],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
})
export class CreateRoomComponent implements OnInit {
  roomNameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  constructor(
    private readonly store: AppStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    effect(() => {
      if (store.player() === undefined) {
        this.navigateToSetupPlayer();
      }
    });

    effect(() => {
      if (store.currentRoom()) {
        this.router.navigate(['lobby']);
      }
    })
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.queryParamMap.get("room") ?? undefined;

    this.tryJoinRoom(roomId);
  }

  navigateToSetupPlayer() {
    this.router.navigate(['setup', 'player'], {
      queryParams: { room: this.route.snapshot.queryParamMap.get('room') },
    });
  }

  handleNext() {
    if (this.roomNameControl.valid) {
      const playerId = this.store.player()?.id;

      this.store.createRoom({ name: this.roomNameControl.value!, playerId: playerId!, rounds: 4 })
    } else {
      let s = "Could not submit! The following validation errors occured: \n\n"

      for (const e of Object.entries(this.roomNameControl.errors!)) {
        s += e[0]
      }

      alert(s);
    }
  }

  tryJoinRoom(roomId: string | undefined) {
    const playerId = this.store.player()?.id;

    if (roomId && playerId) {
      this.store.joinRoom({ playerId, roomId });
    }
  }
}
