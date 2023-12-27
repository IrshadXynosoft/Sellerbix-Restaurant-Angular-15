import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipReportComponent } from './tip-report.component';

describe('TipReportComponent', () => {
  let component: TipReportComponent;
  let fixture: ComponentFixture<TipReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
