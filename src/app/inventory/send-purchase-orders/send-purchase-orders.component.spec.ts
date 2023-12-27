import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPurchaseOrdersComponent } from './send-purchase-orders.component';

describe('SendPurchaseOrdersComponent', () => {
  let component: SendPurchaseOrdersComponent;
  let fixture: ComponentFixture<SendPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPurchaseOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
