import { Component, Input, SimpleChanges, NgModule, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-input-card',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './input-card.component.html',
  styleUrl: './input-card.component.scss',
})
export class InputCardComponent {
  @Input() usage!: string;
  @Input() placeholder!: string;
  @Input() textControl!: FormControl;

  @Output() onNext = new EventEmitter();
}
