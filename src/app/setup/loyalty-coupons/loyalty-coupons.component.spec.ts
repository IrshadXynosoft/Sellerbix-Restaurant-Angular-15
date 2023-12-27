import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyCouponsComponent } from './loyalty-coupons.component';

describe('LoyaltyCouponsComponent', () => {
  let component: LoyaltyCouponsComponent;
  let fixture: ComponentFixture<LoyaltyCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyCouponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
