import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderDiscountComponent } from './edit-order-discount.component';

describe('EditOrderDiscountComponent', () => {
  let component: EditOrderDiscountComponent;
  let fixture: ComponentFixture<EditOrderDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrderDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
