import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReportDetailComponent } from './po-report-detail.component';

describe('PoReportDetailComponent', () => {
  let component: PoReportDetailComponent;
  let fixture: ComponentFixture<PoReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
