import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseReportComponent } from './category-wise-report.component';

describe('CategoryWiseReportComponent', () => {
  let component: CategoryWiseReportComponent;
  let fixture: ComponentFixture<CategoryWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryWiseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
