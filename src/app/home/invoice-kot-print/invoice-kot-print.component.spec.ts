import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceKotPrintComponent } from './invoice-kot-print.component';

describe('InvoiceKotPrintComponent', () => {
  let component: InvoiceKotPrintComponent;
  let fixture: ComponentFixture<InvoiceKotPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceKotPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceKotPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
