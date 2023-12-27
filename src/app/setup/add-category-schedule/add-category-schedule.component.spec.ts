import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryScheduleComponent } from './add-category-schedule.component';

describe('AddCategoryScheduleComponent', () => {
  let component: AddCategoryScheduleComponent;
  let fixture: ComponentFixture<AddCategoryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCategoryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
