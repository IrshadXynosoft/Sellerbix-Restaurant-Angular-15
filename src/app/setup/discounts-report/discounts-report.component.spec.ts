import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsReportComponent } from './discounts-report.component';

describe('DiscountsReportComponent', () => {
  let component: DiscountsReportComponent;
  let fixture: ComponentFixture<DiscountsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
