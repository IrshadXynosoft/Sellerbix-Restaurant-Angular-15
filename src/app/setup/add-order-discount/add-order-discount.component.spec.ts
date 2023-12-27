import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderDiscountComponent } from './add-order-discount.component';

describe('AddOrderDiscountComponent', () => {
  let component: AddOrderDiscountComponent;
  let fixture: ComponentFixture<AddOrderDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrderDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
