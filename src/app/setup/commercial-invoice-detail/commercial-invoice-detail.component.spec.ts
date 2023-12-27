import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInvoiceDetailComponent } from './commercial-invoice-detail.component';

describe('CommercialInvoiceDetailComponent', () => {
  let component: CommercialInvoiceDetailComponent;
  let fixture: ComponentFixture<CommercialInvoiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialInvoiceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
