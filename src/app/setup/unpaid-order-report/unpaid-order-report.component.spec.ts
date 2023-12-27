import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidOrderReportComponent } from './unpaid-order-report.component';

describe('UnpaidOrderReportComponent', () => {
  let component: UnpaidOrderReportComponent;
  let fixture: ComponentFixture<UnpaidOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidOrderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
