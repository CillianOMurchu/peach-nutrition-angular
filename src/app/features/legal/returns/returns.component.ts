import { Component } from '@angular/core';
import { COMPANY } from '@core/constants/company.const';

@Component({
  selector: 'app-returns',
  standalone: true,
  templateUrl: './returns.component.html',
  styleUrl: '../legal.component.scss',
})
export class ReturnsComponent {
  protected readonly co = COMPANY;
}
