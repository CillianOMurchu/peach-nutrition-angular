import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PintrestGridComponent } from './pintrest-grid.component';

describe('PintrestGridComponent', () => {
  let component: PintrestGridComponent;
  let fixture: ComponentFixture<PintrestGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PintrestGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PintrestGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
