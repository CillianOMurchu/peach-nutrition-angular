import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  value = input<string>('');
  searched = output<string>();

  onInput(e: Event) {
    this.searched.emit((e.target as HTMLInputElement).value);
  }

  onClear() {
    this.searched.emit('');
  }
}