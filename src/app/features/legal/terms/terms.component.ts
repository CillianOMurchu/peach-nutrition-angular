import { Component } from '@angular/core';
import { COMPANY } from '@core/constants/company.const';

@Component({
  selector: 'app-terms',
  standalone: true,
  templateUrl: './terms.component.html',
  styleUrl: '../legal.component.scss',
})
export class TermsComponent {
  protected readonly co = COMPANY;
}
