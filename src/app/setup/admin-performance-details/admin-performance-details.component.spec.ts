import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerformanceDetailsComponent } from './admin-performance-details.component';

describe('AdminPerformanceDetailsComponent', () => {
  let component: AdminPerformanceDetailsComponent;
  let fixture: ComponentFixture<AdminPerformanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPerformanceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPerformanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
