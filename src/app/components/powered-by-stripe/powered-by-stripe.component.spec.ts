import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoweredByStripeComponent } from './powered-by-stripe.component';

describe('PoweredByStripeComponent', () => {
  let component: PoweredByStripeComponent;
  let fixture: ComponentFixture<PoweredByStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoweredByStripeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoweredByStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
