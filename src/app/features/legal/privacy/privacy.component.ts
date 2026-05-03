import { Component } from '@angular/core';
import { COMPANY } from '@core/constants/company.const';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrl: '../legal.component.scss',
})
export class PrivacyComponent {
  protected readonly co = COMPANY;
}
