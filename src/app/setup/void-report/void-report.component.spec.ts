import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidReportComponent } from './void-report.component';

describe('VoidReportComponent', () => {
  let component: VoidReportComponent;
  let fixture: ComponentFixture<VoidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
