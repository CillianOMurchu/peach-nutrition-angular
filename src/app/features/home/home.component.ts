import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductMosaicComponent } from '@components/product-mosaic/product-mosaic.component';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductMosaicComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  productService = inject(ProductService);
  featured = this.productService.featuredProducts;
  mosaic = this.productService.mosaicProducts;
  @ViewChildren('animateIn') animateEls!: QueryList<ElementRef>;

  brands = [
    {
      id: 'nocco',
      label: 'NOCCO',
      logo: 'images/logos/logo-nocco.png',
      desc: 'BCAA Energy Drinks',
    },
    {
      id: 'barebells',
      label: 'Barebells',
      logo: 'images/logos/logo-barebells.svg',
      desc: 'Protein Bars',
    },
    {
      id: 'iogenix',
      label: 'iOGenix',
      logo: 'images/logos/logo-iogenix.png',
      desc: 'Whey Protein',
    },
  ];

  stats = [
    { value: '19', label: 'Products' },
    { value: '3', label: 'Premium Brands' },
    { value: '20g+', label: 'Protein / Bar' },
    { value: '0', label: 'Added Sugar' },
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    this.animateEls.forEach((el) => observer.observe(el.nativeElement));

    // also re-observe when featured products load
    this.animateEls.changes.subscribe((list: QueryList<ElementRef>) => {
      list.forEach((el) => observer.observe(el.nativeElement));
    });
  }
}
