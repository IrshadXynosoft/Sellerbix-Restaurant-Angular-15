import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModifyReasonComponent } from './add-modify-reason.component';

describe('AddModifyReasonComponent', () => {
  let component: AddModifyReasonComponent;
  let fixture: ComponentFixture<AddModifyReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModifyReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModifyReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
