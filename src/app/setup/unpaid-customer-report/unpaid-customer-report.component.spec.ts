import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidCustomerReportComponent } from './unpaid-customer-report.component';

describe('UnpaidCustomerReportComponent', () => {
  let component: UnpaidCustomerReportComponent;
  let fixture: ComponentFixture<UnpaidCustomerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidCustomerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
