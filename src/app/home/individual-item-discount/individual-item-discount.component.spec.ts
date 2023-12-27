import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualItemDiscountComponent } from './individual-item-discount.component';

describe('IndividualItemDiscountComponent', () => {
  let component: IndividualItemDiscountComponent;
  let fixture: ComponentFixture<IndividualItemDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualItemDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualItemDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
