import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemDiscountComponent } from './add-item-discount.component';

describe('AddItemDiscountComponent', () => {
  let component: AddItemDiscountComponent;
  let fixture: ComponentFixture<AddItemDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
