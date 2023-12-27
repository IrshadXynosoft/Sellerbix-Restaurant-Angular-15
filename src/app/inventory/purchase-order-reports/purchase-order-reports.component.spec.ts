import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderReportsComponent } from './purchase-order-reports.component';

describe('PurchaseOrderReportsComponent', () => {
  let component: PurchaseOrderReportsComponent;
  let fixture: ComponentFixture<PurchaseOrderReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
