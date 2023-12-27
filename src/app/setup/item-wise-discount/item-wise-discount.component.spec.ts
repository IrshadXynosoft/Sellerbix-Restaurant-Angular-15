import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWiseDiscountComponent } from './item-wise-discount.component';

describe('ItemWiseDiscountComponent', () => {
  let component: ItemWiseDiscountComponent;
  let fixture: ComponentFixture<ItemWiseDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemWiseDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWiseDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
