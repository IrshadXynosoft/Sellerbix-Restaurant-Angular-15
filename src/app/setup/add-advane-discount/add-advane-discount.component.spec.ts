import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvaneDiscountComponent } from './add-advane-discount.component';

describe('AddAdvaneDiscountComponent', () => {
  let component: AddAdvaneDiscountComponent;
  let fixture: ComponentFixture<AddAdvaneDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdvaneDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdvaneDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
