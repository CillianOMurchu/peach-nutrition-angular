import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '@core/models/product.model';
import { effectivePrice } from '@core/utils/pricing';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'peach_nutrition_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());
  private _open = signal(false);

  // ── Public readonly ────────────────────────────────────────
  readonly items = this._items.asReadonly();
  readonly isOpen = this._open.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this._items().reduce(
      (sum, i) => sum + effectivePrice(i.product) * i.quantity,
      0,
    ),
  );

  readonly isEmpty = computed(() => this._items().length === 0);

  constructor() {
    // persist to localStorage whenever items change
    effect(() => {
      localStorage.setItem(CART_KEY, JSON.stringify(this._items()));
    });
  }

  // ── Drawer ─────────────────────────────────────────────────
  open() {
    this._open.set(true);
  }
  close() {
    this._open.set(false);
  }
  toggle() {
    this._open.update((v) => !v);
  }

  // ── Cart actions ───────────────────────────────────────────
  add(product: Product, quantity = 1) {
    this._items.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: Math.min(
                  i.quantity + quantity,
                  product.stockQuantity,
                ),
              }
            : i,
        );
      }
      return [...items, { product, quantity }];
    });
    this._open.set(true);
  }

  remove(productId: string) {
    this._items.update((items) =>
      items.filter((i) => i.product.id !== productId),
    );
  }

  increment(productId: string) {
    this._items.update((items) =>
      items.map((i) =>
        i.product.id === productId && i.quantity < i.product.stockQuantity
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    );
  }

  decrement(productId: string) {
    this._items.update((items) =>
      items
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }

  clear() {
    this._items.set([]);
  }

  // ── Storage ────────────────────────────────────────────────
  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
