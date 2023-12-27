import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastageReportComponent } from './wastage-report.component';

describe('WastageReportComponent', () => {
  let component: WastageReportComponent;
  let fixture: ComponentFixture<WastageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WastageReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WastageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
