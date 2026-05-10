import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/models/product.model';

const ASPECT_RATIOS = ['3/4', '1/1', '2/3', '1/1', '3/4', '4/5'];

@Component({
  selector: 'app-product-mosaic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-mosaic.component.html',
  styleUrl: './product-mosaic.component.scss',
})
export class ProductMosaicComponent {
  products = input.required<Product[]>();

  aspectRatio(index: number): string {
    return ASPECT_RATIOS[index % ASPECT_RATIOS.length];
  }
}
