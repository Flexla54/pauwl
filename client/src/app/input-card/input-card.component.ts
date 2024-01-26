import { Component, Input, SimpleChanges, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-input-card',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FormsModule],
  templateUrl: './input-card.component.html',
  styleUrl: './input-card.component.scss',
})
export class InputCardComponent {
  @Input() usage: 'username' | 'room name' = 'username';

  placeholder: string = '';

  usersInput: string = '';
  constructor() {
    this.placeholder =
      this.usage == 'username' ? 'Sunflower🌻' : 'Gunthers Stube';
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('usage' in changes) {
    }
  }
}
