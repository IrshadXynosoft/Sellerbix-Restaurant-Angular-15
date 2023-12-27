import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInvoicePaymentDialogComponent } from './commercial-invoice-payment-dialog.component';

describe('CommercialInvoicePaymentDialogComponent', () => {
  let component: CommercialInvoicePaymentDialogComponent;
  let fixture: ComponentFixture<CommercialInvoicePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialInvoicePaymentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialInvoicePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
