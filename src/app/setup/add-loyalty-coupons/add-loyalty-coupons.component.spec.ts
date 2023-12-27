import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoyaltyCouponsComponent } from './add-loyalty-coupons.component';

describe('AddLoyaltyCouponsComponent', () => {
  let component: AddLoyaltyCouponsComponent;
  let fixture: ComponentFixture<AddLoyaltyCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoyaltyCouponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLoyaltyCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
