import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStaffRoleComponent } from './add-new-staff-role.component';

describe('AddNewStaffRoleComponent', () => {
  let component: AddNewStaffRoleComponent;
  let fixture: ComponentFixture<AddNewStaffRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewStaffRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
