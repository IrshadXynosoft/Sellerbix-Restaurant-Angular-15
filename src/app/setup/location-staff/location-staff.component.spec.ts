import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationStaffComponent } from './location-staff.component';

describe('LocationStaffComponent', () => {
  let component: LocationStaffComponent;
  let fixture: ComponentFixture<LocationStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
