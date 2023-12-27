import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInvoiceComponent } from './commercial-invoice.component';

describe('CommercialInvoiceComponent', () => {
  let component: CommercialInvoiceComponent;
  let fixture: ComponentFixture<CommercialInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
