import { Component, Signal, effect } from '@angular/core';
import { RoundDto } from '../../../libs/api-connector/src/model/round-dto';
import { AppStore } from '../core/state/app.store';
import { ButtonModule } from 'primeng/button';
import { Route, Router } from '@angular/router';
import { STATE_SIGNAL } from '@ngrx/signals/src/state-signal';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.scss',
})
export class VotingComponent {
  public readonly previousRound: Signal<RoundDto | undefined>;

  public alreadyVoted = false;

  constructor(
    private readonly store: AppStore,
    private readonly router: Router
  ) {
    this.previousRound = store.previousRound;

    effect(() => {
      if (this.store.allVoted()) {
        this.router.navigateByUrl('/editor');
      }

      console.log(this.store.currentRoom()?.rounds)
      if (this.store.currentRoom()?.rounds.every(r => r.answers?.reduce((p, c) => p + c.score, 0) === this.store.currentRoom()?.players?.length)) {
        this.router.navigateByUrl("/ranking");
      }
    });
  }

  submitVote(answerId: string) {
    this.store.submitVote(answerId);
    this.alreadyVoted = true;
  }
}
