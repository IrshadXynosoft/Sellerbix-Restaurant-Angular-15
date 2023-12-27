import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastageReportDetailComponent } from './wastage-report-detail.component';

describe('WastageReportDetailComponent', () => {
  let component: WastageReportDetailComponent;
  let fixture: ComponentFixture<WastageReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WastageReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WastageReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
