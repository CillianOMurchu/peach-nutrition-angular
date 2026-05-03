import { Component } from '@angular/core';
import { COMPANY } from '@core/constants/company.const';

@Component({
  selector: 'app-shipping',
  standalone: true,
  templateUrl: './shipping.component.html',
  styleUrl: '../legal.component.scss',
})
export class ShippingComponent {
  protected readonly co = COMPANY;
}
