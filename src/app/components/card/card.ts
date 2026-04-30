import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() description!: string;
  @Input() complement!: string;
  @Input() icon!: string;
  @Input() habtsCompleted = 0;
  @Input() width: string = '272px'; // valor padrão
  @Input() height: string = '107px'; // valor padrão
}
