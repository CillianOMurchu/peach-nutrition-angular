import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '@core/models/product.model';
import { CartItem, CartService } from '@core/services/cart.service';
import { environment } from '../../../environments/environment.production';
import { CartDrawerComponent } from './cart-drawer.component';

const BASE_PRODUCT: Product = {
  id: 'prod-1',
  name: 'Test Bar',
  brand: 'barebells',
  category: 'protein-bar',
  price: 30,
  discountPercentage: 0,
  stockQuantity: 10,
  images: [{ src: 'img.png', alt: 'img' }],
  description: '',
  review: { rating: 5, count: 1 },
  tags: [],
  featured: false,
};

// Shared signal so individual tests can swap cart contents
let mockItemsSignal: ReturnType<typeof signal<CartItem[]>>;

function buildCartService(items: CartItem[] = [{ product: { ...BASE_PRODUCT }, quantity: 2 }]) {
  mockItemsSignal = signal<CartItem[]>(items);
  return {
    items: mockItemsSignal.asReadonly(),
    isOpen: signal(true).asReadonly(),
    totalItems: computed(() => mockItemsSignal().reduce((s, i) => s + i.quantity, 0)),
    subtotal: computed(() => mockItemsSignal().reduce((s, i) => s + i.product.price * i.quantity, 0)),
    isEmpty: computed(() => mockItemsSignal().length === 0),
    clear: jasmine.createSpy('clear'),
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open'),
    toggle: jasmine.createSpy('toggle'),
    add: jasmine.createSpy('add'),
    remove: jasmine.createSpy('remove'),
    increment: jasmine.createSpy('increment'),
    decrement: jasmine.createSpy('decrement'),
  };
}

describe('CartDrawerComponent', () => {
  let component: CartDrawerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: buildCartService() },
      ],
    }).compileComponents();

    component = TestBed.createComponent(CartDrawerComponent).componentInstance;
  });

  // ── itemTotal() ───────────────────────────────────────────────────────────

  describe('itemTotal()', () => {
    it('returns price × quantity when there is no discount', () => {
      const item: CartItem = { product: { ...BASE_PRODUCT, price: 30, discountPercentage: 0 }, quantity: 3 };
      expect(component.itemTotal(item)).toBeCloseTo(90);
    });

    it('applies discount percentage before multiplying by quantity', () => {
      // 40 × (1 − 0.25) × 2 = 60
      const item: CartItem = { product: { ...BASE_PRODUCT, price: 40, discountPercentage: 25 }, quantity: 2 };
      expect(component.itemTotal(item)).toBeCloseTo(60);
    });
  });

  // ── openConfirm / closeConfirm ────────────────────────────────────────────

  describe('openConfirm() / closeConfirm()', () => {
    it('openConfirm() sets confirmOpen to true', () => {
      component.openConfirm();
      expect(component.confirmOpen()).toBeTrue();
    });

    it('closeConfirm() resets confirmOpen to false after it was opened', () => {
      component.openConfirm();
      component.closeConfirm();
      expect(component.confirmOpen()).toBeFalse();
    });
  });

  // ── checkout() ────────────────────────────────────────────────────────────

  describe('checkout()', () => {
    let fetchSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;

    const stripeCheckoutUrl = 'https://checkout.stripe.com/pay/test_session';

    const okResponse = (url = stripeCheckoutUrl) =>
      new Response(JSON.stringify({ url }), { status: 200 });

    beforeEach(() => {
      // Spy on the component method so tests don't actually navigate
      navigateSpy = spyOn(component, 'navigateTo');
      fetchSpy = spyOn(window, 'fetch');
    });

    it('calls the backend endpoint with the correct URL', async () => {
      fetchSpy.and.resolveTo(okResponse());
      await component.checkout();

      expect(fetchSpy).toHaveBeenCalledWith(
        `${environment.backendUrl}/create-checkout-session`,
        jasmine.anything()
      );
    });

    it('sends a POST with the correct item payload', async () => {
      fetchSpy.and.resolveTo(okResponse());
      await component.checkout();

      const body = JSON.parse(fetchSpy.calls.first().args[1].body);
      expect(body).toEqual({
        items: [{ name: 'Test Bar', price: 30, quantity: 2 }],
      });
    });

    it('uses the discounted price in the request payload', async () => {
      mockItemsSignal.set([{
        product: { ...BASE_PRODUCT, price: 40, discountPercentage: 25 },
        quantity: 1,
      }]);
      fetchSpy.and.resolveTo(okResponse());

      await component.checkout();

      const { items } = JSON.parse(fetchSpy.calls.first().args[1].body);
      expect(items[0].price).toBeCloseTo(30); // 40 × (1 − 0.25)
    });

    it('redirects to the Stripe URL returned by the backend', async () => {
      fetchSpy.and.resolveTo(okResponse(stripeCheckoutUrl));
      await component.checkout();
      expect(navigateSpy).toHaveBeenCalledOnceWith(stripeCheckoutUrl);
    });

    it('sets checkoutError on a non-ok HTTP response', async () => {
      fetchSpy.and.resolveTo(new Response('{}', { status: 500 }));
      await component.checkout();
      expect(component.checkoutError()).toBe('Something went wrong. Please try again.');
    });

    it('sets checkoutError on a network failure', async () => {
      fetchSpy.and.rejectWith(new Error('Network error'));
      await component.checkout();
      expect(component.checkoutError()).toBe('Something went wrong. Please try again.');
    });

    it('clears checkoutError at the start of a new attempt', async () => {
      component.checkoutError.set('Previous error');
      fetchSpy.and.resolveTo(okResponse());
      await component.checkout();
      expect(component.checkoutError()).toBe('');
    });

    it('clears checkoutLoading after a successful checkout', async () => {
      fetchSpy.and.resolveTo(okResponse());
      await component.checkout();
      expect(component.checkoutLoading()).toBeFalse();
    });

    it('clears checkoutLoading even when an error occurs', async () => {
      fetchSpy.and.rejectWith(new Error('fail'));
      await component.checkout();
      expect(component.checkoutLoading()).toBeFalse();
    });

    it('does nothing if already loading (prevents double submission)', async () => {
      component.checkoutLoading.set(true);
      await component.checkout();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
