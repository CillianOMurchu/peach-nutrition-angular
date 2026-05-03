import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY } from '@core/constants/company.const';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly co = COMPANY;

  readonly paymentMethods = [
    { src: 'images/logos/payment/visa.svg', alt: 'Visa' },
    { src: 'images/logos/payment/mastercard.svg', alt: 'Mastercard' },
    { src: 'images/logos/payment/apple.svg', alt: 'Apple Pay' },
    { src: 'images/logos/payment/google.svg', alt: 'Google Pay' },
  ];
}
