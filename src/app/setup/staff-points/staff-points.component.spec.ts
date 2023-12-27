import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPointsComponent } from './staff-points.component';

describe('StaffPointsComponent', () => {
  let component: StaffPointsComponent;
  let fixture: ComponentFixture<StaffPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
