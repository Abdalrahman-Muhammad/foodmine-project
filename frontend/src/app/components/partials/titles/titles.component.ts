import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.css'],
})
export class TitlesComponent {
  @Input() title!: string;
  @Input() margin? = '1rem 0 1rem 0.2rem';
  @Input() fontSize? = '1.7rem';
}
