import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementReportComponent } from './settlement-report.component';

describe('SettlementReportComponent', () => {
  let component: SettlementReportComponent;
  let fixture: ComponentFixture<SettlementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
