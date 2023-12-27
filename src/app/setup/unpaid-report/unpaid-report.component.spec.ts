import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidReportComponent } from './unpaid-report.component';

describe('UnpaidReportComponent', () => {
  let component: UnpaidReportComponent;
  let fixture: ComponentFixture<UnpaidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpaidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
