import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,  
  selector: 'app-pintrest-grid',
  imports: [],
  templateUrl: './pintrest-grid.component.html',
  styleUrl: './pintrest-grid.component.scss',
})
export class PintrestGridComponent {
  @Input() gap = 16;
}
