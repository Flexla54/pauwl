import { Component, effect } from '@angular/core';
import { InputCardComponent } from '../components/input-card/input-card.component';
import { FormControl, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStore } from '../core/state/app.store';

@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [InputCardComponent],
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.scss'
})
export class CreatePlayerComponent {
  roomNameControl = new FormControl('', [Validators.required, Validators.minLength(5)])

  constructor(private readonly router: Router, private readonly store: AppStore) {
    effect(() => {
      if (this.store.player() !== undefined) {
        router.navigate(['setup', 'room'], { queryParamsHandling: 'preserve' })
      }
    })
  }

  nextHandler() {
    if (this.roomNameControl.valid) {
      this.store.createPlayer({ name: this.roomNameControl.value! })
    } else {
      let s = "Could not submit! The following validation errors occured: \n\n"

      for (const e of Object.entries(this.roomNameControl.errors!)) {
        s += e[0]
      }

      alert(s);
    }
  }
}
