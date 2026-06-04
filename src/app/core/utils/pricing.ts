import { Product } from '@core/models/product.model';

/**
 * The discounted unit price, or null when the product has no discount.
 * Use for displaying an original/discounted price pair.
 */
export function discountedPrice(product: Product): number | null {
  if (!product.discountPercentage) return null;
  return product.price * (1 - product.discountPercentage / 100);
}

/**
 * The effective unit price a customer pays — the discounted price when
 * discounted, otherwise the list price. Never null. Use for totals.
 */
export function effectivePrice(product: Product): number {
  return discountedPrice(product) ?? product.price;
}
