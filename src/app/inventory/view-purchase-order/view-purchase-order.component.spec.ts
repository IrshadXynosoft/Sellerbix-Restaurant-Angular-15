import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseOrderComponent } from './view-purchase-order.component';

describe('ViewPurchaseOrderComponent', () => {
  let component: ViewPurchaseOrderComponent;
  let fixture: ComponentFixture<ViewPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
