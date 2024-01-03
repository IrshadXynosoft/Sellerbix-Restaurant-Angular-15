import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedbackComponent } from './edit-feedback.component';

describe('EditFeedbackComponent', () => {
  let component: EditFeedbackComponent;
  let fixture: ComponentFixture<EditFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
