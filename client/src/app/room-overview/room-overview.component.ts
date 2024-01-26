import { Component, Input } from '@angular/core';
import { RoomDto } from '../../../libs/api-connector/src/model/room-dto';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-room-overview',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './room-overview.component.html',
  styleUrl: './room-overview.component.scss',
})
export class RoomOverviewComponent {
  @Input() room!: RoomDto;
}
