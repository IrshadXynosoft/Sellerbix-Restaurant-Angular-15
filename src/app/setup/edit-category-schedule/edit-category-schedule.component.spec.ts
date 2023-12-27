import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryScheduleComponent } from './edit-category-schedule.component';

describe('EditCategoryScheduleComponent', () => {
  let component: EditCategoryScheduleComponent;
  let fixture: ComponentFixture<EditCategoryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCategoryScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCategoryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
