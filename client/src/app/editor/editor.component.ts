import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
} from '@angular/core';
import { AppStore } from '../core/state/app.store';
import { RoundDto } from '../../../libs/api-connector/src/model/round-dto';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  public readonly currentRound: Signal<RoundDto | undefined>;
  public readonly alreadyAnsweredCurrentRound: Signal<boolean>;
  public readonly captionControl = new FormControl('', [Validators.required]);

  constructor(private readonly store: AppStore) {
    this.currentRound = store.currentRound;
    this.alreadyAnsweredCurrentRound = store.submittedAnswerForCurrentRound;
    effect(() => console.log(this.store.currentRoom())); // This is needed as i am too dumb to use signals
    // Elaboration: The submittedAnswerForCurrentRound signal is not updated until some user interaction is recorded
    //              I do not know why this is the case, the UI should subscribed to this anyways as it is a computed
    //              signal. However, simply creating an effect on the currentRoom fixes this issues :shrug:
  }

  public submit() {
    if (!this.captionControl.valid) {
      alert('Please input a caption!');
    }

    this.store.submitAnswer(this.captionControl.value!);

    this.captionControl.setValue('');
  }
}
