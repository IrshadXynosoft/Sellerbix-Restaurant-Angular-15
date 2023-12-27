import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountOrderDetailsComponent } from './discount-order-details.component';

describe('DiscountOrderDetailsComponent', () => {
  let component: DiscountOrderDetailsComponent;
  let fixture: ComponentFixture<DiscountOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
