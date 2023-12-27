import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderReportComponent } from './reorder-report.component';

describe('ReorderReportComponent', () => {
  let component: ReorderReportComponent;
  let fixture: ComponentFixture<ReorderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReorderReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
