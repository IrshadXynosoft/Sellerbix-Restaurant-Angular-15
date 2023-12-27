import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStaffRoleComponent } from './edit-staff-role.component';

describe('EditStaffRoleComponent', () => {
  let component: EditStaffRoleComponent;
  let fixture: ComponentFixture<EditStaffRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStaffRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
