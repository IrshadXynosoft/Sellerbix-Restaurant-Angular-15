import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePurchaseOrderComponent } from './receive-purchase-order.component';

describe('ReceivePurchaseOrderComponent', () => {
  let component: ReceivePurchaseOrderComponent;
  let fixture: ComponentFixture<ReceivePurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivePurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
