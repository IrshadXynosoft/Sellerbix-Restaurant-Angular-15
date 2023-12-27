import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorPasswordComponent } from './supervisor-password.component';

describe('SupervisorPasswordComponent', () => {
  let component: SupervisorPasswordComponent;
  let fixture: ComponentFixture<SupervisorPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
