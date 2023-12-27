import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemDiscountComponent } from './edit-item-discount.component';

describe('EditItemDiscountComponent', () => {
  let component: EditItemDiscountComponent;
  let fixture: ComponentFixture<EditItemDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditItemDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
