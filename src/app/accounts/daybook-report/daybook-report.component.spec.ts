import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybookReportComponent } from './daybook-report.component';

describe('DaybookReportComponent', () => {
  let component: DaybookReportComponent;
  let fixture: ComponentFixture<DaybookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaybookReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaybookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
