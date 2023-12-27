import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvaneDiscountComponent } from './advane-discount.component';

describe('AdvaneDiscountComponent', () => {
  let component: AdvaneDiscountComponent;
  let fixture: ComponentFixture<AdvaneDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvaneDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvaneDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
