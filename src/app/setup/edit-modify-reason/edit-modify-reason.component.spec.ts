import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModifyReasonComponent } from './edit-modify-reason.component';

describe('EditModifyReasonComponent', () => {
  let component: EditModifyReasonComponent;
  let fixture: ComponentFixture<EditModifyReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditModifyReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModifyReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
