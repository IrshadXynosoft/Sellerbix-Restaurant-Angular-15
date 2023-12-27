import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInvoiceReportComponent } from './commercial-invoice-report.component';

describe('CommercialInvoiceReportComponent', () => {
  let component: CommercialInvoiceReportComponent;
  let fixture: ComponentFixture<CommercialInvoiceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialInvoiceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
