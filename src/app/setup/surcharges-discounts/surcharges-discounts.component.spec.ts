import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurchargesDiscountsComponent } from './surcharges-discounts.component';

describe('SurchargesDiscountsComponent', () => {
  let component: SurchargesDiscountsComponent;
  let fixture: ComponentFixture<SurchargesDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurchargesDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurchargesDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
