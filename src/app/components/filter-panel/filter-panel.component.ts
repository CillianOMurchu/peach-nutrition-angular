import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Brand, Category } from '@core/models/product.model';
import { FilterState } from '@core/services/product.service';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent {
  filters = input.required<FilterState>();

  brandToggled    = output<Brand>();
  categoryToggled = output<Category>();
  inStockToggled  = output<void>();
  cleared         = output<void>();

  brands: { value: Brand; label: string }[] = [
    { value: 'barebells', label: 'Barebells' },
    { value: 'nocco',     label: 'NOCCO'     },
    { value: 'iogenix',   label: 'iOGenix'   },
  ];

  categories: { value: Category; label: string }[] = [
    { value: 'protein-bar',    label: 'Protein Bars'    },
    { value: 'energy-drink',   label: 'Energy Drinks'   },
    { value: 'protein-powder', label: 'Protein Powder'  },
  ];

  isBrandActive(brand: Brand): boolean {
    return this.filters().brands.includes(brand);
  }

  isCategoryActive(cat: Category): boolean {
    return this.filters().categories.includes(cat);
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    return !!(f.brands.length || f.categories.length || f.inStockOnly);
  }
}