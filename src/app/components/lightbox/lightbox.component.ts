import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { ProductImage } from '@core/models/product.model';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent implements OnChanges {
  @Input() images: ProductImage[] = [];
  @Input() open = false;
  @Input() initialIndex = 0;
  @Output() closed = new EventEmitter<void>();

  index = signal(0);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']?.currentValue === true) {
      this.index.set(this.initialIndex);
    }
  }

  prev() {
    this.index.update(i => (i - 1 + this.images.length) % this.images.length);
  }

  next() {
    this.index.update(i => (i + 1) % this.images.length);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open) this.closed.emit();
  }

  @HostListener('document:keydown.arrowleft')
  onLeft() {
    if (this.open && this.images.length > 1) this.prev();
  }

  @HostListener('document:keydown.arrowright')
  onRight() {
    if (this.open && this.images.length > 1) this.next();
  }
}
