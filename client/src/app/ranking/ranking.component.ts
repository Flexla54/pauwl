import { Component, Signal, effect } from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { PlayerDto } from '../../../libs/api-connector/src/model/player-dto';
import { ButtonModule } from "primeng/button";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  public readonly ranking: Signal<(PlayerDto | undefined)[]>;

  constructor(private readonly store: AppStore) {
    this.ranking = store.ranking;
    
    effect(() => console.log(this.ranking()))
  }
}
