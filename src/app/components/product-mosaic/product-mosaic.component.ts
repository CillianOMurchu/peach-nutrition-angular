import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-product-mosaic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-mosaic.component.html',
  styleUrl: './product-mosaic.component.scss',
})
export class ProductMosaicComponent {
  products = input.required<Product[]>();
}
